import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Page from '@/components/templates/Page';
import PostRiver from '@/components/templates/PostRiver';
import { serverEnv } from '@/env/serverEnv';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { getDocumentLink } from '@/lib/links';
import { paginatedData } from '@/lib/pagination';
import { client } from '@/lib/sanity/client/client';
import { sanityFetch } from '@/lib/sanity/client/live';
import { categoryQuery, categorySlugs, postsArchiveQuery } from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ categorySlug: string }>;
};

const loadData = async (props: Props) => {
  const { categorySlug } = await props.params;

  const from = 0;
  const to = POSTS_PER_PAGE - 1;

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
    posts: paginatedData(archiveData, 0, POSTS_PER_PAGE),
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { category } = (await loadData(props)) || {};

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

export default async function PostPage(props: Props) {
  const { posts, category } = (await loadData(props)) || {};

  if (!category) {
    notFound();
  }

  return (
    <Page title={'Category: ' + category.title}>
      <PostRiver
        listingData={posts.data}
        currentPage={posts.currentPage}
        totalPages={posts.totalPages}
        paginationBase={`/category/${category.slug}`}
      />
    </Page>
  );
}
