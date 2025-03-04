import { MediaText } from '@/sanity.types';
import { Image } from 'next-sanity/image';
import { urlForImage } from '@/sanity/lib/utils';
import { type PortableTextBlock } from 'next-sanity';
import PortableText from '@/components/PortableText';
import { cn } from '@/utils/styles';

export default function MediaTextSection({ section }: { section: MediaText }) {
  return (
    <div
      className={cn('container py-10 md:py-14 mx-auto flex flex-col lg:flex-row', {
        'order-2': section?.imagePosition === 'right',
      })}
    >
      <div className="lg:w-1/2">
        <Image
          alt={section.image?.alt || ''}
          className="shadow-md rounded-4xl"
          width="1000"
          height="667"
          src={urlForImage(section.image)?.width(1000).height(667).url() as string}
        />
      </div>
      <div className="lg:w-1/2 lg:p-12 mt-8 lg:mt-0 flex flex-col justify-center">
        <h2 className=" text-4xl font-bold leading-tight tracking-tighter lg:text-5xl mb-5">
          {section?.heading}
        </h2>
        <div className="text-xl mb-5">
          <PortableText className="" value={section.text as PortableTextBlock[]} />
        </div>
      </div>
    </div>
  );
}
