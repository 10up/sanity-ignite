import type { PortableTextBlock } from 'next-sanity';
import type { SubscribeSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import PortableText from '../../modules/PortableText';
import SubscribeForm from './SubscribeForm';

export default function SubscribeSection({ section }: { section: SubscribeSectionFragmentType }) {
  return (
    <section className="py-10 md:py-14 bg-white container mx-auto">
      <div className="bg-gradient-to-r from-pink-500 to-blue-500 py-16 md:py-24 rounded-4xl container">
        <div className="">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{section?.heading}</h2>
            <div className="[&_p]:text-white">
              <PortableText value={section.content as PortableTextBlock[]} />
            </div>
            <SubscribeForm section={section} />
          </div>
        </div>
      </div>
    </section>
  );
}
