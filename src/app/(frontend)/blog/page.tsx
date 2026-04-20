import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Page from '@/components/templates/Page';
import PostRiver from '@/components/templates/PostRiver';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { paginatedData } from '@/lib/pagination';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { blogPageQuery, postsArchiveQuery } from '@/lib/sanity/queries/queries';
import {
  blogPageSchema,
  postsArchiveSchema,
} from '@/lib/sanity/queries/schemas';

const loadPostsPageData = async () => {
  const [blogPage, posts] = await Promise.all([
    sanityFetch({
      query: blogPageQuery,
      schema: blogPageSchema,
      cache: { profile: 'hours', tags: ['sanity:type:blogPage'] },
    }),
    sanityFetch({
      query: postsArchiveQuery,
      params: { from: 0, to: POSTS_PER_PAGE - 1, filters: {} },
      schema: postsArchiveSchema,
      cache: { profile: 'hours', tags: ['sanity:type:post'] },
    }),
  ]);

  return {
    blogPage,
    posts: posts ? paginatedData(posts, 1, POSTS_PER_PAGE) : null,
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const { blogPage } = await loadPostsPageData();

  if (!blogPage?.seo) {
    return {};
  }

  return formatMetaData(
    blogPage.seo as Parameters<typeof formatMetaData>[0],
    blogPage?.name || ''
  );
}

export default async function PostPage() {
  const { blogPage, posts } = await loadPostsPageData();

  if (!posts || !blogPage) {
    notFound();
  }

  return (
    <Page title={`${blogPage?.name} - Page ${posts.currentPage}`}>
      <PostRiver
        listingData={posts.data}
        currentPage={posts.currentPage}
        totalPages={posts.totalPages}
      />
    </Page>
  );
}
