import type { CategoryFragmentType } from '@/lib/sanity/queries/schemas';

export const CategoryHero = ({
  category,
}: {
  category: CategoryFragmentType;
}) => {
  return (
    <section className="relative overflow-hidden bg-ink text-white px-7 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/15"
      />
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="font-display my-4.5 text-6xl font-extrabold leading-none tracking-tight text-paper lg:text-7xl text-balance">
            {category.title}
          </h1>
        </div>
        <p className="relative text-muted-on-dark text-base leading-[1.55] max-w-[560px]">
          {category.description}
        </p>
        <div className="relative flex gap-2 flex-wrap mt-5">
          {[
            'All',
            'Sanity',
            'Next.js',
            'Vercel',
            'AI',
            'Edge',
            'WordPress',
            'Contentful',
            'Shopify',
          ].map((t, i) => (
            <span
              key={i}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium font-mono text-white cursor-pointer ${
                i === 0
                  ? 'bg-purple border-0'
                  : 'bg-white/[0.08] border border-line-dark'
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
