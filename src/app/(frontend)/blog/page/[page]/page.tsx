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

type Props = {
  params: Promise<{ page: string }>;
};

const loadPostsPageData = async (props: Props) => {
  const { page } = await props.params;
  const pageNumber = parseInt(page, 10);

  if (!pageNumber) {
    notFound();
  }

  const [blogPage, posts] = await Promise.all([
    sanityFetch({
      query: blogPageQuery,
      schema: blogPageSchema,
      cache: { profile: 'hours', tags: ['sanity:type:blogPage'] },
    }),
    sanityFetch({
      query: postsArchiveQuery,
      params: {
        from: (pageNumber - 1) * POSTS_PER_PAGE,
        to: pageNumber * POSTS_PER_PAGE - 1,
        filters: {},
      },
      schema: postsArchiveSchema,
      cache: { profile: 'hours', tags: ['sanity:type:post'] },
    }),
  ]);

  return {
    blogPage,
    posts: posts ? paginatedData(posts, pageNumber, POSTS_PER_PAGE) : null,
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { blogPage, posts } = await loadPostsPageData(props);

  if (!blogPage || !posts) {
    return notFound();
  }

  if (!blogPage.seo) {
    return {};
  }

  const seo = formatMetaData(
    blogPage.seo as Parameters<typeof formatMetaData>[0],
    blogPage?.name || ''
  );
  seo.title += ` - Page ${posts.currentPage}`;

  return seo;
}

export async function generateStaticParams() {
  return [];
}

export default async function PostPage(props: Props) {
  const { blogPage, posts } = await loadPostsPageData(props);

  if (!blogPage || !posts) {
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
