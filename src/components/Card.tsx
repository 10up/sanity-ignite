import { Card as CardType } from '@/sanity.types';
import PortableText from './PortableText';
import { type PortableTextBlock } from 'next-sanity';

export default function Card({ card: { heading, text } }: { card: CardType }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <h3 className="text-xl font-semibold mb-6">{heading}</h3>
      <div className="text-gray-600">
        <PortableText className="text-xl" value={text as PortableTextBlock[]} />
      </div>
    </div>
  );
}
