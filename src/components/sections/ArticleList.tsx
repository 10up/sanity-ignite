import { ArticleGrid } from '@/components/sections/ArticleGrid';
import type { ArticleListSectionFragmentType } from '@/lib/sanity/queries/schemas';

export default function ArticleListSection({
  section,
}: {
  section: ArticleListSectionFragmentType;
}) {
  const { articles } = section;
  if (!articles.length) {
    return null;
  }
  switch (section.layout) {
    case 'top-stories':
      return <ArticleGrid section={section} />;
    default:
      return null;
  }
}
