import { Hero } from '@/sanity.types';
import { Image } from 'next-sanity/image';
import { urlForImage } from '@/sanity/lib/utils';
import { type PortableTextBlock } from 'next-sanity';
import PortableText from '@/components/PortableText';

export default function HeroSection({ section }: { section: Hero }) {
  return (
    <div className="relative">
      {section.image ? (
        <Image
          alt={section.image.alt || ''}
          className="object-cover w-full sm:max-h-[700px] min-h-[400px] brightness-50"
          width="1000"
          height="667"
          src={urlForImage(section.image)?.width(1000).height(667).url() as string}
        />
      ) : null}
      <div className="p-12 flex flex-col justify-center absolute h-full items-center w-full top-0 left-0 right-0 bottom-0">
        <h2 className="text-4xl text-white font-bold text-center leading-tight tracking-tighter lg:text-5xl mb-5">
          {section?.heading}
        </h2>
        <div>
          <PortableText
            className="text-xl text-white text-center"
            value={section.text as PortableTextBlock[]}
          />
        </div>
      </div>
    </div>
  );
}
