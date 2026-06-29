/**
 * Presentational Open Graph card — the single source of truth for the social
 * share image. It is rendered in two places:
 *
 *  1. `/api/og/[type]/[slug]/route.tsx` → passed to `next/og`'s `ImageResponse`,
 *     which rasterises it to PNG with Satori.
 *  2. `src/studio/components/SocialImageInput.tsx` → rendered straight to the DOM so
 *     editors get a live, accurate preview as they type.
 *
 * Because Satori only supports a subset of CSS, this component is restricted to
 * what works in BOTH renderers: flexbox layout and inline styles only (no grid,
 * no class names, no external CSS). Keep it that way — the Studio preview is
 * only trustworthy because it is literally the same component that ships.
 */

import type { CSSProperties } from 'react';

export const OG_CARD_SIZE = { width: 1200, height: 630 } as const;

export type OgCardLayout = 'left' | 'right';

export type OgCardProps = {
  headline: string;
  excerpt?: string;
  /** Absolute, pre-sized background image URL (1200×630). Omit for a flat fill. */
  imageUrl?: string;
  /** Absolute logo URL for the footer bar. */
  logoUrl?: string;
  siteName?: string;
  layout?: OgCardLayout;
};

// Dark is the only theme. The scrim + light type keep the card legible over any
// background image.
const palette = {
  fill: '#0b0b0b',
  text: '#ffffff',
  accent: '#6e5bff',
  subtext: 'rgba(255, 255, 255, 0.82)',
  footerBg: 'rgba(11, 11, 12, 0.88)',
  footerText: 'rgba(255, 255, 255, 0.92)',
  footerBorder: 'rgba(255, 255, 255, 0.14)',
  buttonText: 'rgba(255, 255, 255, 0.92)',
};

// Multi-line truncation that works in both Satori and the browser. The WebKit
// box props aren't in React's CSSProperties types, hence the cast.
function clamp(lines: number, style: CSSProperties): CSSProperties {
  return {
    ...style,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lines,
    overflow: 'hidden',
  } as CSSProperties;
}

// Scrim that keeps the text legible over any photo. Heaviest on the side the
// text sits on, fading toward the opposite edge.
function scrim(layout: OgCardLayout): string {
  const base = '11, 11, 12';
  const dir = layout === 'right' ? '270deg' : '90deg';
  return `linear-gradient(${dir}, rgba(${base}, 0.5) 0%, rgba(${base}, 0.7) 42%, rgba(${base}, 0.4) 100%)`;
}

export function OgCard({
  headline,
  excerpt,
  imageUrl,
  logoUrl,
  siteName,
  layout = 'left',
}: OgCardProps) {
  const alignText = layout === 'right' ? 'flex-end' : 'flex-start';

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: OG_CARD_SIZE.width,
        height: OG_CARD_SIZE.height,
        backgroundColor: palette.fill,
        fontFamily: 'Geist',
        overflow: 'hidden',
      }}
    >
      {imageUrl ? (
        // biome-ignore lint/performance/noImgElement: Satori only renders <img>, not next/image
        <img
          src={imageUrl}
          alt=""
          width={OG_CARD_SIZE.width}
          height={OG_CARD_SIZE.height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: OG_CARD_SIZE.width,
            height: OG_CARD_SIZE.height,
            objectFit: 'cover',
          }}
        />
      ) : null}

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: OG_CARD_SIZE.width,
          height: OG_CARD_SIZE.height,
          backgroundImage: scrim(layout),
        }}
      />

      {/* Headline + excerpt */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flex: 1,
          padding: '72px 80px',
          alignItems: 'center',
          justifyContent: layout === 'right' ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: alignText,
            maxWidth: 660,
            textAlign: layout === 'right' ? 'right' : 'left',
          }}
        >
          <div
            style={clamp(3, {
              fontFamily: 'Geist',
              fontWeight: 700,
              fontSize: 66,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              color: palette.text,
            })}
          >
            {headline}
          </div>
          {excerpt ? (
            <div
              style={clamp(2, {
                fontFamily: 'Geist',
                fontWeight: 400,
                marginTop: 24,
                fontSize: 28,
                lineHeight: 1.4,
                color: palette.subtext,
              })}
            >
              {excerpt}
            </div>
          ) : null}
          <div
            style={{
              borderRadius: '2rem',
              height: '48px',
              backgroundColor: palette.accent,
              color: palette.buttonText,
              padding: '12px 24px',
              fontFamily: 'Geist',
              fontWeight: 500,
              fontSize: 22,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '44px',
            }}
          >
            <span>Learn More</span>
          </div>
        </div>
      </div>

      {/* Lower border bar — houses the logo */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 112,
          padding: '0 80px',
          backgroundColor: palette.footerBg,
          borderTop: `1px solid ${palette.footerBorder}`,
        }}
      >
        {logoUrl ? (
          // biome-ignore lint/performance/noImgElement: Satori only renders <img>, not next/image
          <img
            src={logoUrl}
            alt={siteName ?? ''}
            height={32}
            style={{ height: 32, maxWidth: 380, objectFit: 'contain' }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              fontFamily: 'Geist Mono',
              fontWeight: 500,
              fontSize: 30,
              color: palette.footerText,
            }}
          >
            {siteName ?? ''}
          </div>
        )}
        {logoUrl && siteName ? (
          <div
            style={{
              display: 'flex',
              fontFamily: 'Geist Mono',
              fontWeight: 500,
              fontSize: 22,
              color: palette.footerText,
            }}
          >
            {siteName}
          </div>
        ) : null}
      </div>
    </div>
  );
}
