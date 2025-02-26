import { Cta } from '@/sanity.types';
import * as v from 'valibot';

const requiredPropSchema = v.object({
  heading: v.string(),
  text: v.string(),
  buttonText: v.string(),
  link: v.object({
    href: v.string(),
  }),
});

export default function CTASection({ section }: { section: Cta }) {
  const result = v.safeParse(requiredPropSchema, section);
  if (!result.success) {
    return null;
  }
  return (
    <div className="py-28 text-center bg-red-300">
      <h2 className="text-center text-4xl font-bold leading-tight tracking-tighter lg:text-5xl mb-5">
        {section?.heading}
      </h2>
      <h3 className="text-xl mb-5">{section?.text}</h3>
      <div className="flex justify-center">
        <a
          href={section?.link?.href}
          className="rounded-full flex gap-2 items-center bg-black hover:bg-red-500 py-3 px-6 text-white transition-colors duration-200"
        >
          {section?.buttonText}
        </a>
      </div>
    </div>
  );
}
