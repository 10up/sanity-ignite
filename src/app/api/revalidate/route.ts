import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { serverEnv } from '@/env/serverEnv';

type SanityWebhookPayload = {
  _type: string;
  slug?: { current?: string };
};

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
      req,
      serverEnv.SANITY_WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: 'Missing document type' },
        { status: 400 }
      );
    }

    const tags: string[] = [`sanity:type:${body._type}`];

    if (body.slug?.current) {
      tags.push(`sanity:slug:${body.slug.current}`);
    }

    for (const tag of tags) {
      revalidateTag(tag, { expire: 0 });
    }

    return NextResponse.json({
      revalidated: true,
      tags,
    });
  } catch (err) {
    console.error('[revalidate] Webhook error:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
