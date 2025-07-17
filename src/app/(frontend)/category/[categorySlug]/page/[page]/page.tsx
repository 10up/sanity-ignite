import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Page from '@/components/templates/Page';
import PostRiver from '@/components/templates/PostRiver';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { getDocumentLink } from '@/lib/links';
import { paginatedData } from '@/lib/pagination';
import { sanityFetch } from '@/lib/sanity/client/live';
import { categoryQuery, postsArchiveQuery } from '@/lib/sanity/queries/queries';

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
  const to = pageNumber * POSTS_PER_PAGE - 1;

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
    posts: paginatedData(archiveData, pageNumber, POSTS_PER_PAGE),
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { posts, category } = (await loadData(props)) || {};

  const { currentPage = 1 } = posts || {};

  if (!category) {
    return notFound();
  }

  return {
    title:
      currentPage === 1
        ? `Category ${category.title} `
        : `Category ${category.title} - Page ${currentPage}`,
    alternates: {
      canonical: getDocumentLink(category, true),
    },
  };
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  return [];
}

export default async function PostPage(props: Props) {
  const { posts, category } = (await loadData(props)) || {};

  if (!category || !posts) {
    notFound();
  }

  return (
    <Page title={`Category: ${category.title}`}>
      <PostRiver
        listingData={posts.data}
        currentPage={posts.currentPage}
        totalPages={posts.totalPages}
        paginationBase={`/category/${category.slug}`}
      />
    </Page>
  );
}
