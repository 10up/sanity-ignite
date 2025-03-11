import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { categoryQuery, postsArchiveQuery } from '@/sanity/queries/queries';
import { paginatedData } from '@/lib/pagination';
import CategoryRoute from '../CategoryRoute';
import { Metadata } from 'next';
import { getDocumentLink } from '@/lib/links';

const POSTS_PER_PAGE = 10;

type Props = {
  params: Promise<{ categorySlug: string; page: string }>;
};

const loadData = async (props: Props) => {
  const { page, categorySlug } = await props.params;

  const pageNumber = parseInt(page, 10);

  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    return null;
  }

  const from = (pageNumber - 1) * POSTS_PER_PAGE;
  const to = pageNumber * POSTS_PER_PAGE + 1;

  const [{ data: archiveData }, { data: categoryData }] = await Promise.all([
    sanityFetch({
      query: postsArchiveQuery,
      params: { from, to, filters: { categorySlug } },
    }),
    sanityFetch({
      query: categoryQuery,
      params: { slug: categorySlug },
    }),
  ]);

  return {
    category: categoryData,
    listing: paginatedData(archiveData, pageNumber, POSTS_PER_PAGE),
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { listing, category } = (await loadData(props)) || {};

  const { currentPage = 1 } = listing || {};

  if (!category) {
    return {};
  }

  return {
    title: currentPage === 1 ? `Category ${category.title} ` : `Category - Page ${currentPage}`,
    alternates: {
      canonical: getDocumentLink(category, true),
    },
  };
}

export default async function PostPage(props: Props) {
  const { listing, category } = (await loadData(props)) || {};

  if (!category) {
    notFound();
  }

  return <CategoryRoute category={category} listingData={listing} />;
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  return [];
}
