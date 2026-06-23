import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isSameOrigin } from '@/lib/http/sameOrigin';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { searchArticlesQuery } from '@/lib/sanity/queries/queries';
import { searchResultsSchema } from '@/lib/sanity/queries/schemas';

// Streams a short, LLM-generated overview of the search results. This is the
// real version of the "stream in" effect: `toTextStreamResponse()` emits plain
// UTF-8 token chunks that the client reads incrementally.
//
// The Anthropic provider reads ANTHROPIC_API_KEY from the environment. When it's
// absent the feature degrades gracefully (204) so the scaffold still boots and
// search keeps working without an LLM key.
//
// The only user-controlled input is the search term — the articles fed to the
// model are re-fetched server-side with the same query as GET /api/search, so a
// caller can't fabricate prompt content. Because both routes call `sanityFetch`
// with identical args, they share the `'use cache'` entry: a warm cache makes
// this second fetch effectively free.
//
// Because every call costs money, the route is defended in three layers:
//  1. Same-origin guard — blocks other sites calling it from a browser.
//  2. Per-IP rate limit — caps how often any one client can call it.
//  3. Server-authoritative inputs + a capped term length bound the prompt size.

// Cap the only free-text input. Each summary is also truncated below as defense
// in depth, even though it now comes from our own CMS rather than the client.
const MAX_TERM_LENGTH = 200;
const MAX_SUMMARY_LENGTH = 500;

const requestSchema = z.object({
  searchTerm: z.string().trim().min(1).max(MAX_TERM_LENGTH),
});

// Naive fixed-window per-IP limiter. In-memory and per-instance: fine for
// `next start` / a single server and as a reference. On serverless or
// multi-region deploys (e.g. Vercel) each instance has its own memory, so swap
// this for a shared store like @upstash/ratelimit to enforce the window
// globally.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const requestLog = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestLog.get(ip);

  if (!entry || now > entry.resetAt) {
    requestLog.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count += 1;
  return false;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim() || 'unknown';
}

// Haiku 4.5 by default — cheapest current model, ideal for this short
// summarization task. Bump to claude-sonnet-4-6 for higher quality. Use
// versioned IDs (not `-latest` aliases, which Anthropic has retired).
const SEARCH_MODEL = process.env.ANTHROPIC_SEARCH_MODEL ?? 'claude-haiku-4-5';

const SYSTEM_PROMPT = `You are a search bot for an article archive. You are given a user's search term and the list of articles that matched their search. Review the articles and the search term, then write a single overview introduction to the result list that helps guide the user. Speak directly to the user. Plain text only — no markdown, no lists, no preamble, no dashes, naturally written. Your response must be no more than 50 words.`;

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { message: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new NextResponse(null, { status: 204 });
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const { searchTerm } = parsed.data;

  // Same query/params/cache as GET /api/search, so this shares the cache entry.
  const articles = await sanityFetch({
    query: searchArticlesQuery,
    params: { searchTerm },
    schema: searchResultsSchema,
    cache: { profile: 'hours', tags: ['sanity:type:article'] },
    bypassLiveFetch: true,
  });

  // Nothing to summarize — skip the model call entirely.
  if (!articles || articles.length === 0) {
    return new NextResponse(null, { status: 204 });
  }

  const articleList = articles
    .map((article, index) => {
      const summary = article.summary?.slice(0, MAX_SUMMARY_LENGTH);
      return `${index + 1}. ${article.title}${summary ? ` — ${summary}` : ''}`;
    })
    .join('\n');

  const result = streamText({
    model: anthropic(SEARCH_MODEL),
    system: SYSTEM_PROMPT,
    prompt: `Search term: "${searchTerm}"\n\nMatching articles:\n${articleList}`,
    maxOutputTokens: 120,
    temperature: 0.3,
  });

  return result.toTextStreamResponse();
}
