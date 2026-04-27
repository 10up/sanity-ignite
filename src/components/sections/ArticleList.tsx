import { TopStories } from '@/components/sections/TopStories';
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
      return <TopStories section={section} />;
    default:
      return null;
  }
}
