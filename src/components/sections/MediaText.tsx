import type { PortableTextBlock } from 'next-sanity';
import { Image } from 'next-sanity/image';
import PortableText from '@/components/modules/BlockContent';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { MediaTextSectionFragmentType } from '@/lib/sanity/queries/schemas';
import { cn } from '@/utils/styles';

export default function MediaTextSection({
  section,
}: {
  section: MediaTextSectionFragmentType;
}) {
  const imageUrl = section.image?.asset
    ? urlForImage(section.image)?.width(1200).height(900).url()
    : undefined;
  const imageRight = section?.imagePosition === 'right';

  return (
    <section className="mx-auto max-w-7xl px-0 py-7 lg:px-7 border-line border-b bg-white pb-8 ">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        {/* On mobile the image always leads; on lg it moves right when chosen. */}
        <div className={cn('min-w-0', imageRight && 'lg:order-2')}>
          {imageUrl && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-line">
              <Image
                alt={section.image?.alt || ''}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 38rem, 100vw"
                src={imageUrl}
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="min-w-0">
          {section?.subtitle && (
            <p className="font-bold text-xxs uppercase tracking-wider text-purple">
              {section.subtitle}
            </p>
          )}
          {section?.heading && (
            <h2 className="mt-1.5 font-display text-balance font-extrabold text-4xl leading-none tracking-tight text-ink lg:text-5xl">
              {section.heading}
            </h2>
          )}
          <div className="mt-4 max-w-xl">
            <PortableText value={section.content as PortableTextBlock[]} />
          </div>
        </div>
      </div>
    </section>
  );
}
