import type { CtaSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import ButtonsGroup from '../modules/ButtonsGroup';

export default function CtaSection({ section }: { section: CtaSectionFragmentType }) {
  return (
    <section className="py-10 md:py-14 bg-white container mx-auto">
      <div className="bg-gradient-to-r from-pink-500 to-blue-500 py-16 md:py-24 rounded-4xl container">
        <div className="">
          <div className="max-w-3xl mx-auto text-center items-center flex flex-col">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{section?.heading}</h2>
            <p className="text-xl text-white mb-8">{section?.text}</p>

            {section?.buttons && section?.buttons.length > 0 && (
              <ButtonsGroup buttons={section?.buttons} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
