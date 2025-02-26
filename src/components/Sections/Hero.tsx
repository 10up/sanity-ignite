import { Hero } from '@/sanity.types';
import { Image } from 'next-sanity/image';
import { urlForImage } from '@/sanity/lib/utils';
import { type PortableTextBlock } from 'next-sanity';
import PortableText from '@/components/PortableText';

export default function HeroSection({ section }: { section: Hero }) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{section?.heading}</h1>
            <PortableText className="text-xl" value={section.text as PortableTextBlock[]} />

            <div className="mt-8">
              <a
                href="#"
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors inline-block"
              >
                Get Started Free
              </a>
            </div>
          </div>
          <div className="relative">
            <Image
              src={urlForImage(section.image)?.width(1000).height(667).url() as string}
              alt={section?.image?.alt || ''}
              width={600}
              height={400}
              className="rounded-4xl shadow-xl"
            />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-500 rounded-full opacity-50"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
