import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Page from '@/components/templates/Page';
import PostRiver from '@/components/templates/PostRiver';
import { serverEnv } from '@/env/serverEnv';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { getDocumentLink } from '@/lib/links';
import { paginatedData } from '@/lib/pagination';
import { client } from '@/lib/sanity/client/client';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import {
  categoryQuery,
  categorySlugs,
  postsArchiveQuery,
} from '@/lib/sanity/queries/queries';
import {
  categorySchema,
  postsArchiveSchema,
} from '@/lib/sanity/queries/schemas';

type Props = {
  params: Promise<{ categorySlug: string }>;
};

const loadData = async (props: Props) => {
  const { categorySlug } = await props.params;

  const [posts, category] = await Promise.all([
    sanityFetch({
      query: postsArchiveQuery,
      params: { from: 0, to: POSTS_PER_PAGE - 1, filters: { categorySlug } },
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
    posts: posts ? paginatedData(posts, 1, POSTS_PER_PAGE) : null,
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { category } = await loadData(props);

  if (!category) {
    return notFound();
  }

  return {
    title: `Category ${category.title}`,
    alternates: {
      canonical: getDocumentLink(category, true),
    },
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch(categorySlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });

  return slugs
    ? slugs
        .filter((slug: string | null) => slug !== null)
        .map((slug: string | null) => ({
          categorySlug: slug,
          pagination: undefined,
        }))
    : [];
}

export default async function PostPage(props: Props) {
  const { posts, category } = await loadData(props);

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
