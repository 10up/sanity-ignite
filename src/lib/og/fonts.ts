import 'server-only';

/**
 * Loads a Google Font as a raw font buffer for `next/og`/Satori.
 *
 * Satori only accepts `ttf`/`otf`/`woff` (not `woff2`), so we request the CSS
 * with an old desktop User-Agent — Google then serves a `truetype` source we
 * can fetch directly. Passing the `text` that will be rendered subsets the font
 * to just those glyphs, keeping us well under the `ImageResponse` bundle limit.
 *
 * Results are memoised per (family, weight, text) for the life of the server
 * instance, so repeated requests for the same card don't refetch.
 */

const cache = new Map<string, Promise<ArrayBuffer>>();

const LEGACY_UA =
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0 Safari/537.36';

async function fetchFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer> {
  const params = new URLSearchParams({
    family: `${family}:wght@${weight}`,
  });
  if (text) params.set('text', text);

  const cssUrl = `https://fonts.googleapis.com/css2?${params.toString()}`;
  const css = await (
    await fetch(cssUrl, { headers: { 'User-Agent': LEGACY_UA } })
  ).text();

  // Satori accepts ttf/otf/woff (not woff2). With the legacy UA above, Google
  // serves a `woff` source, so match any of the three.
  const match = css.match(
    /src:\s*url\((.+?)\)\s*format\('(?:opentype|truetype|woff)'\)/
  );
  if (!match) {
    throw new Error(
      `Could not extract a font source for "${family}" @${weight}`
    );
  }

  const fontResponse = await fetch(match[1]);
  if (!fontResponse.ok) {
    throw new Error(`Failed to download font "${family}" @${weight}`);
  }
  return fontResponse.arrayBuffer();
}

export function loadGoogleFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer> {
  const key = `${family}:${weight}:${text}`;
  let pending = cache.get(key);
  if (!pending) {
    pending = fetchFont(family, weight, text);
    // Don't cache a rejected fetch — let the next request retry.
    pending.catch(() => cache.delete(key));
    cache.set(key, pending);
  }
  return pending;
}
