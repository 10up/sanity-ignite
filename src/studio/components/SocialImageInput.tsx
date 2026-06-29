import { Card, Stack, Text } from '@sanity/ui';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { type BooleanInputProps, useClient, useFormValue } from 'sanity';
import { clientEnv } from '@/env/clientEnv';
import { OG_CARD_SIZE, OgCard, type OgCardLayout } from '@/lib/og/OgCard';
import { urlForImage } from '@/lib/sanity/client/utils';

type SanityImage = Parameters<typeof urlForImage>[0];

// The sibling SEO fields the card reads. This input is attached to the
// `generateCard` boolean, so it reaches its siblings via the parent object.
type SeoParent = {
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: SanityImage;
  cardLayout?: string;
  cardHeadline?: string;
  cardExcerpt?: string;
};

// Document-level fields used as fallbacks for the headline/excerpt/image.
type ParentDoc = {
  title?: string;
  name?: string;
  excerpt?: string;
  image?: SanityImage;
};

/**
 * Scales the fixed 1200×630 card down to the available field width so editors
 * see it at the document's true aspect ratio.
 */
function ScaledCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setScale(el.clientWidth / OG_CARD_SIZE.width);
    const observer = new ResizeObserver((entries) => {
      setScale(entries[0].contentRect.width / OG_CARD_SIZE.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          height: OG_CARD_SIZE.height * scale,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: OG_CARD_SIZE.width,
            height: OG_CARD_SIZE.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SocialImageInput(props: BooleanInputProps) {
  const { renderDefault } = props;
  // `props.path` is e.g. ['seo', 'generateCard']; the parent is the SEO object.
  const seo = useFormValue(props.path.slice(0, -1)) as SeoParent | undefined;
  const doc = useFormValue([]) as ParentDoc | undefined;

  const client = useClient({
    apiVersion: clientEnv.NEXT_PUBLIC_SANITY_API_VERSION,
  });
  const [settings, setSettings] = useState<{
    logo?: SanityImage;
    title?: string;
    ogImage?: SanityImage;
  }>({});

  useEffect(() => {
    let active = true;
    client
      .fetch<{ logo?: SanityImage; title?: string; ogImage?: SanityImage }>(
        '*[_type == "settings"][0]{logo, title, ogImage}'
      )
      .then((result) => {
        if (active && result) setSettings(result);
      })
      .catch(() => {
        // Preview is best-effort; ignore fetch failures.
      });
    return () => {
      active = false;
    };
  }, [client]);

  // Only show the preview once the card is toggled on; otherwise just the
  // default toggle.
  if (!props.value) {
    return renderDefault(props);
  }

  const headline =
    seo?.cardHeadline ||
    seo?.metaTitle ||
    doc?.title ||
    doc?.name ||
    'Your headline appears here';
  const excerpt =
    seo?.cardExcerpt || seo?.metaDescription || doc?.excerpt || undefined;
  // Background falls back exactly like the API route: meta image → document
  // image → site OG image.
  const image = seo?.metaImage || doc?.image || settings.ogImage;

  const imageUrl =
    urlForImage(image)
      ?.width(OG_CARD_SIZE.width)
      .height(OG_CARD_SIZE.height)
      // biome-ignore lint/suspicious/noFocusedTests: .fit() is an image-url method, not a test
      .fit('crop')
      .url() ?? undefined;
  const logoUrl = urlForImage(settings.logo)?.height(160).url() ?? undefined;

  const layout: OgCardLayout = seo?.cardLayout === 'right' ? 'right' : 'left';

  return (
    <Stack space={4}>
      {renderDefault(props)}
      <Stack space={2}>
        <Text size={1} muted weight="semibold">
          Social card preview
        </Text>
        <Card radius={2} shadow={1} overflow="hidden">
          <ScaledCard>
            <OgCard
              headline={headline}
              excerpt={excerpt}
              imageUrl={imageUrl}
              logoUrl={logoUrl}
              siteName={settings.title}
              layout={layout}
            />
          </ScaledCard>
        </Card>
      </Stack>
    </Stack>
  );
}
