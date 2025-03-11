import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { categoryQuery, categorySlugs, postsArchiveQuery } from '@/sanity/queries/queries';
import { paginatedData } from '@/lib/pagination';
import CategoryRoute from './CategoryRoute';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { serverEnv } from '@/env/serverEnv';
import { getDocumentLink } from '@/lib/links';

const POSTS_PER_PAGE = 12;

type Props = {
  params: Promise<{ categorySlug: string }>;
};

const loadData = async (props: Props) => {
  const { categorySlug } = await props.params;

  const from = 0;
  const to = POSTS_PER_PAGE;

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
    listing: paginatedData(archiveData, 0, POSTS_PER_PAGE),
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
  const slugs = await client.fetch(categorySlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });

  return slugs
    ? slugs
        .filter((slug) => slug !== null)
        .map((slug) => ({ categorySlug: slug, pagination: undefined }))
    : [];
}
