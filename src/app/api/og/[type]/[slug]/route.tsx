import { ImageResponse } from 'next/og';
import { loadGoogleFont } from '@/lib/og/fonts';
import { OG_CARD_SIZE, OgCard } from '@/lib/og/OgCard';
import { client } from '@/lib/sanity/client/client';
import { urlForImage } from '@/lib/sanity/client/utils';
import { ogCardQuery } from '@/lib/sanity/queries/queries';

// Document types we will render a card for. `type` is passed to GROQ as a bound
// parameter (no string interpolation), so this is a sanity check, not an
// injection guard — it just keeps the route from rendering cards for unexpected
// types.
const RENDERABLE_TYPES = new Set(['page', 'article', 'homePage']);

type RouteParams = { params: Promise<{ type: string; slug: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { type, slug } = await params;

  if (!RENDERABLE_TYPES.has(type)) {
    return new Response('Not found', { status: 404 });
  }

  const data = await client.fetch(ogCardQuery, { type, slug });

  if (!data) {
    return new Response('Not found', { status: 404 });
  }

  const headline = data.headline ?? data.siteName ?? '';
  const excerpt = data.excerpt ?? undefined;
  const siteName = data.siteName ?? undefined;
  const layout = data.layout === 'right' ? 'right' : 'left';

  const imageUrl = data.image
    ? (urlForImage(data.image)
        ?.width(OG_CARD_SIZE.width)
        .height(OG_CARD_SIZE.height)
        // biome-ignore lint/suspicious/noFocusedTests: .fit() is an image-url method, not a test
        .fit('crop')
        .url() ?? undefined)
    : undefined;
  const logoUrl = data.logo
    ? (urlForImage(data.logo)?.height(160).url() ?? undefined)
    : undefined;

  // Subset each face to only the glyphs this card uses. Matches the front end:
  // Geist Sans for the headline/excerpt, Geist Mono for the footer label.
  const text = `${headline}${excerpt ?? ''}${siteName ?? ''}`;
  const [geist, geistBold, geistMono] = await Promise.all([
    loadGoogleFont('Geist', 400, text),
    loadGoogleFont('Geist', 700, text),
    loadGoogleFont('Geist Mono', 500, text),
  ]);

  return new ImageResponse(
    <OgCard
      headline={headline}
      excerpt={excerpt}
      imageUrl={imageUrl}
      logoUrl={logoUrl}
      siteName={siteName}
      layout={layout}
    />,
    {
      ...OG_CARD_SIZE,
      fonts: [
        { name: 'Geist', data: geist, weight: 400, style: 'normal' },
        { name: 'Geist', data: geistBold, weight: 700, style: 'normal' },
        { name: 'Geist Mono', data: geistMono, weight: 500, style: 'normal' },
      ],
      headers: {
        // Same inputs → same URL → CDN cache hit. `formatMetaData` appends a
        // `?v=<updatedAt>` token so edits produce a fresh URL.
        'Cache-Control': 'public, immutable, no-transform, max-age=31536000',
      },
    }
  );
}
