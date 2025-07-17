import type { PortableTextBlock } from 'next-sanity';
import { Image } from 'next-sanity/image';
import PortableText from '@/components/modules/PortableText';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { HeroSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import ButtonsGroup from '../modules/ButtonsGroup';

export default function HeroSection({ section }: { section: HeroSectionFragmentType }) {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{section?.heading}</h1>
            <PortableText className="text-xl" value={section.text as PortableTextBlock[]} />

            {section?.buttons && section?.buttons.length ? (
              <div className="mt-8 gap-4 flex">
                {section?.buttons.length > 1 && (
                  <ButtonsGroup className="w-full md:w-auto" buttons={section?.buttons} />
                )}
              </div>
            ) : null}
          </div>
          <div className="relative">
            {section.image?.asset && (
              <Image
                src={urlForImage(section.image)?.width(1000).height(667).url() as string}
                alt={section?.image?.alt || ''}
                width={600}
                height={400}
                className="rounded-4xl shadow-xl"
              />
            )}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-500 rounded-full opacity-50"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
