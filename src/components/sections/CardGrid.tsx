import type { PortableTextBlock } from 'next-sanity';
import type { CardGridSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import Card from '../modules/Card';
import PortableText from '../modules/PortableText';

export default function CardGrid({
  section: { heading, content, cards },
}: {
  section: CardGridSectionFragmentType;
}) {
  return (
    <section className="py-12 md:py-16 my-10 md:my-14 bg-gray-50 rounded-4xl ">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          <div className="text-xl text-gray-600">
            <PortableText className="text-xl" value={content as PortableTextBlock[]} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards?.map((card) => <Card key={card.heading} card={card} />)}
        </div>
      </div>
    </section>
  );
}
