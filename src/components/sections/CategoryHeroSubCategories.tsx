import Link from 'next/link';
import { getDocumentLink } from '@/lib/links';
import { cn } from '@/lib/utils';

export const CategoryHeroSubCategories = ({
  parentSlug,
  subcategories,
  activeSubcategory,
}: {
  parentSlug: string;
  subcategories: { title: string; slug: string }[];
  activeSubcategory: string | null;
}) => {
  const chipClass = (isActive: boolean) =>
    cn(
      'px-3.5 py-1.5 rounded-full text-xs font-medium font-mono text-white',
      isActive
        ? 'bg-purple border-0'
        : 'bg-white/[0.08] border border-line-dark'
    );

  return (
    <div className="relative flex gap-2 flex-wrap mt-5">
      <Link
        href={getDocumentLink({ _type: 'category', slug: parentSlug })}
        className={chipClass(activeSubcategory === null)}
        aria-current={activeSubcategory === null ? 'true' : undefined}
      >
        All
      </Link>
      {subcategories.map((child) => {
        const isActive = activeSubcategory === child.slug;
        return (
          <Link
            key={child.slug}
            href={getDocumentLink({
              _type: 'category',
              slug: child.slug,
              parentSlug,
            })}
            className={chipClass(isActive)}
            aria-current={isActive ? 'true' : undefined}
          >
            {child.title}
          </Link>
        );
      })}
    </div>
  );
};
