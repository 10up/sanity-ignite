'use client';

import { Loader2Icon, SearchIcon, SparklesIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shadcn/dialog';
import { Input } from '@/components/ui/shadcn/input';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area';
import { getDocumentLink } from '@/lib/links';
import type { SearchResultType } from '@/lib/sanity/queries/schemas';

const MIN_QUERY_LENGTH = 2;
// Results fire quickly so typing feels responsive; the expensive LLM overview
// only fires once the user has clearly stopped, so it never streams in mid-type.
const RESULTS_DEBOUNCE_MS = 300;
const OVERVIEW_DEBOUNCE_MS = 800;

export const SiteSearch = ({
  searchPlaceholder,
}: {
  searchPlaceholder: string;
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultType[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  // Bumped on every settled search so the results list remounts and each card
  // replays its staggered enter animation — the "stream in" effect.
  const [renderKey, setRenderKey] = useState(0);
  const [overview, setOverview] = useState('');
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const abortRef = useRef<AbortController | null>(null);
  const overviewAbortRef = useRef<AbortController | null>(null);

  // Streams an LLM overview of the result set. Reads the plain text stream from
  // the route chunk-by-chunk so the text types itself in. Only the search term
  // is sent — the route re-fetches the articles server-side.
  const streamOverview = useCallback(async (searchTerm: string) => {
    overviewAbortRef.current?.abort();
    const controller = new AbortController();
    overviewAbortRef.current = controller;

    setOverview('');
    setOverviewLoading(true);
    try {
      const res = await fetch('/api/search/overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm }),
        signal: controller.signal,
      });

      // 204 (no API key / no results) or any error → silently skip the overview.
      if (!res.ok || !res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOverview((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('[SiteSearch overview]', err);
      }
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  // Results: short debounce, cancelable. The transition drives `isPending` (no
  // <form> needed — React 19's startTransition tracks the async fetch), and the
  // AbortController discards responses from stale keystrokes.
  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < MIN_QUERY_LENGTH) {
      abortRef.current?.abort();
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timeout = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      startTransition(async () => {
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(trimmed)}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error(`Search failed with status ${res.status}`);
          }
          const data = (await res.json()) as { results: SearchResultType[] };
          setResults(data.results);
          setHasSearched(true);
          setRenderKey((key) => key + 1);
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
          console.error('[SiteSearch]', err);
          setResults([]);
          setHasSearched(true);
        }
      });
    }, RESULTS_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  // Overview: longer debounce, and reset on every keystroke so a stale summary
  // never lingers and nothing streams in until the user has stopped typing.
  useEffect(() => {
    const trimmed = query.trim();

    overviewAbortRef.current?.abort();
    setOverview('');
    setOverviewLoading(false);

    if (trimmed.length < MIN_QUERY_LENGTH) {
      return;
    }

    const timeout = setTimeout(() => {
      void streamOverview(trimmed);
    }, OVERVIEW_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query, streamOverview]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      abortRef.current?.abort();
      overviewAbortRef.current?.abort();
      setQuery('');
      setResults([]);
      setHasSearched(false);
      setOverview('');
      setOverviewLoading(false);
    }
  }

  const isActive = query.trim().length >= MIN_QUERY_LENGTH;
  const showSkeleton = isActive && isPending && results.length === 0;
  const showResults = results.length > 0;
  const showEmpty =
    isActive && hasSearched && !isPending && results.length === 0;
  const showOverview = showResults && (overview.length > 0 || overviewLoading);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="transparent">
          <SearchIcon className="size-5" />
          <span className="sr-only">{searchPlaceholder}</span>
        </Button>
      </DialogTrigger>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[85vh] flex-col gap-3 bg-white p-4"
      >
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Semantic search across the article archive.
        </DialogDescription>

        <div className="relative shrink-0">
          <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 pl-9"
            aria-label={searchPlaceholder}
            id="site-search-input"
          />
          {isActive && isPending && (
            <Loader2Icon className="-translate-y-1/2 absolute top-1/2 right-3 size-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {!isActive && (
          <p className="px-1 font-mono text-muted-foreground text-xxs">
            Semantic Search: Try searching for "What is a Headless CMS?"
          </p>
        )}

        {/* A fixed-height results region keeps the dialog from resizing as states
            swap or the overview streams — everything dynamic lives in the scroll. */}
        {isActive && (
          <div className="flex min-h-0 flex-col gap-2">
            <h2 className="px-1 font-medium font-mono text-muted-foreground text-xxs uppercase tracking-wider">
              Results
            </h2>
            <ScrollArea className="h-[min(55vh,460px)]">
              <div className="flex flex-col gap-2 pr-3">
                {showOverview && (
                  <div className="flex min-h-[3.5rem] gap-2 rounded-lg border border-purple/20 bg-purple/5 p-3">
                    <SparklesIcon className="mt-0.5 size-4 shrink-0 text-purple" />

                    <div className="text-ink text-xs leading-relaxed">
                      <span className="font-mono text-muted-foreground text-xxs uppercase tracking-wider">
                        AI Overview
                      </span>
                      <p className="text-ink text-xs leading-relaxed">
                        {overview || 'Reading the results…'}
                        {overviewLoading && (
                          <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-purple align-middle" />
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {showSkeleton &&
                  ['s1', 's2', 's3', 's4'].map((id) => (
                    <div
                      key={id}
                      className="h-16 animate-pulse rounded-lg bg-muted/60"
                    />
                  ))}

                {showResults && (
                  <ul key={renderKey} className="flex flex-col gap-2">
                    {results.map((result, index) => (
                      <li
                        key={result._id}
                        className="fade-in slide-in-from-bottom-2 fill-mode-both animate-in duration-300"
                        style={{ animationDelay: `${index * 60}ms` }}
                      >
                        <DialogClose asChild>
                          <Link
                            href={
                              result.slug
                                ? getDocumentLink({
                                    _type: 'article',
                                    slug: result.slug,
                                  })
                                : '#'
                            }
                            className="block rounded-lg border border-border p-3 border-l-2 border-l-purple transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                          >
                            <span className="block font-medium text-ink text-sm">
                              {result.title}
                            </span>
                            {result.summary && (
                              <span className="mt-0.5 line-clamp-2 block text-muted-foreground text-xs">
                                {result.summary}
                              </span>
                            )}
                          </Link>
                        </DialogClose>
                      </li>
                    ))}
                  </ul>
                )}

                {showEmpty && (
                  <p className="py-6 text-center text-muted-foreground text-sm">
                    No results for "{query.trim()}"
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        <DialogClose className="-top-10 absolute right-0 flex size-8 items-center justify-center bg-none text-white transition-opacity hover:opacity-70">
          <XIcon className="size-6" />
          <span className="sr-only">Close search</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
