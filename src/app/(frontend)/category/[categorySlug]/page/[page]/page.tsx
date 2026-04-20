import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Page from '@/components/templates/Page';
import PostRiver from '@/components/templates/PostRiver';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { getDocumentLink } from '@/lib/links';
import { paginatedData } from '@/lib/pagination';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { categoryQuery, postsArchiveQuery } from '@/lib/sanity/queries/queries';
import {
  categorySchema,
  postsArchiveSchema,
} from '@/lib/sanity/queries/schemas';

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

  const [posts, category] = await Promise.all([
    sanityFetch({
      query: postsArchiveQuery,
      params: { from, to, filters: { categorySlug } },
      schema: postsArchiveSchema,
      cache: {
        profile: 'hours',
        tags: ['sanity:type:post', `sanity:slug:${categorySlug}`],
      },
    }),
    sanityFetch({
      query: categoryQuery,
      params: { slug: categorySlug },
      schema: categorySchema,
      cache: {
        profile: 'hours',
        tags: ['sanity:type:category', `sanity:slug:${categorySlug}`],
      },
    }),
  ]);

  return {
    category,
    posts: posts ? paginatedData(posts, pageNumber, POSTS_PER_PAGE) : null,
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const result = await loadData(props);
  const { posts, category } = result || {};
  const { currentPage = 1 } = posts || {};

  if (!category) {
    return notFound();
  }

  return {
    title:
      currentPage === 1
        ? `Category ${category.title}`
        : `Category ${category.title} - Page ${currentPage}`,
    alternates: {
      canonical: getDocumentLink(category, true),
    },
  };
}

async function CategoryPageContent(props: Props) {
  const result = await loadData(props);
  const { posts, category } = result || {};

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

export default async function PostPage(props: Props) {
  return (
    <Suspense>
      <CategoryPageContent {...props} />
    </Suspense>
  );
}
