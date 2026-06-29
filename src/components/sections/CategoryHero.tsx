import type { CategoryFragmentType } from '@/lib/sanity/queries/schemas';
import { CategoryHeroSubCategories } from './CategoryHeroSubCategories';

export const CategoryHero = ({
  category,
  activeSubcategory,
}: {
  category: CategoryFragmentType;
  activeSubcategory: string | null;
}) => {
  const subcategories = (category.children ?? []).flatMap((child) =>
    child.slug && child.title ? [{ title: child.title, slug: child.slug }] : []
  );

  return (
    <section className="relative overflow-hidden bg-ink text-white px-7 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/15"
      />
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="font-display my-4.5 text-4xl sm:text-5xl font-extrabold leading-tight lg:leading-none tracking-tight text-paper lg:text-7xl text-balance">
            {category.title}
          </h1>
        </div>
        <p className="relative text-muted-on-dark text-base leading-[1.55] max-w-[560px]">
          {category.description}
        </p>
        {subcategories.length > 0 && category.slug && (
          <CategoryHeroSubCategories
            parentSlug={category.slug}
            subcategories={subcategories}
            activeSubcategory={activeSubcategory}
          />
        )}
      </div>
    </section>
  );
};
