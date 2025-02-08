import { parseBody } from 'next-sanity/webhook';
import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

type WebhookPayload = {
  _type: string;
  slug: string | undefined;
};

export async function POST(req: NextRequest) {
  try {
    // TODO: note to myself: replace it with createEnv once I figure that out.
    const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;
    if (!revalidateSecret) {
      return new Response('Missing environment variable SANITY_REVALIDATE_SECRET', { status: 500 });
    }

    const { body, isValidSignature } = await parseBody<WebhookPayload>(req, revalidateSecret);

    if (!isValidSignature) {
      const message = 'Invalid signature';
      return new Response(JSON.stringify({ message, isValidSignature, body }), {
        status: 401,
      });
    }

    if (!body?._type) {
      const message = 'Bad Request';
      return new Response(JSON.stringify({ message, body }), { status: 400 });
    }

    // Revalidates queries that depend on a list of documents of a specific type.
    revalidateTag(body._type);

    // Revalidates queries that depend on a single document of a specific type.
    if (body.slug) revalidateTag(`${body._type}:${body.slug}`);

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    });
  } catch (err) {
    console.error(err);
    return new Response((err as Error).message, { status: 500 });
  }
}
