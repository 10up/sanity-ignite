import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { postPagesSlugs, postQuery, postsArchiveQuery } from '@/sanity/queries/queries';
import { PaginatedResult, paginatedData, parseUrlParams } from '@/lib/pagination';
import PostRoute from './PostRoute';
import PostListingRoute from './PostListingRoute';
import { PostQueryResult, PostsArchiveQueryResult } from '@/sanity.types';
import { Metadata } from 'next';
import { getDocumentLink } from '@/lib/links';
import { client } from '@/sanity/lib/client';
import { serverEnv } from '@/env/serverEnv';
import { formatMetaData } from '@/sanity/lib/seo';
import { SeoType } from '@/types/seo';
const POSTS_PER_PAGE = 10;

type Props = {
  params: Promise<{ slugOrPagination: string[] | undefined }>;
};

const loadData = async (
  props: Props,
): Promise<PostQueryResult | PaginatedResult<PostsArchiveQueryResult>> => {
  const params = await props.params;
  const parsedUrlParams = parseUrlParams(params.slugOrPagination);

  if (!parsedUrlParams) {
    notFound();
  }

  if ('slug' in parsedUrlParams) {
    const { data: post } = await sanityFetch({
      query: postQuery,
      params: { slug: parsedUrlParams.slug },
    });

    return post;
  }

  const { page } = parsedUrlParams;

  const from = (page - 1) * POSTS_PER_PAGE;
  const to = page * POSTS_PER_PAGE + 1;

  const { data } = await sanityFetch({
    query: postsArchiveQuery,
    params: { from, to, filters: {} },
  });

  return paginatedData(data, page, POSTS_PER_PAGE);
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const routeData = await loadData(props);

  if (!routeData) {
    return {};
  }

  if (routeData._type === 'post') {
    return {
      ...formatMetaData(routeData.seo as unknown as SeoType),
      alternates: {
        canonical: getDocumentLink(routeData, true),
      },
    };
  }

  return {
    title: routeData.currentPage === 1 ? 'Blog' : `Blog - Page ${routeData.currentPage}`,
    alternates: {
      canonical: '/blog',
    },
    description: 'All the latest posts from our blog',
  };
}

export default async function PostPage(props: Props) {
  const routeData = await loadData(props);

  if (!routeData) {
    notFound();
  }

  if (routeData._type === 'post') {
    return <PostRoute post={routeData} />;
  }

  return (
    <PostListingRoute
      listingData={routeData.data}
      currentPage={routeData.currentPage}
      totalPages={routeData.totalPages}
    />
  );
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const slugs = await client.fetch(postPagesSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });

  const staticParams = slugs
    ? slugs.filter((slug) => slug !== null).map((slug) => ({ slugOrPagination: [slug] }))
    : [];

  return [
    {
      slugOrPagination: undefined,
    },
    ...staticParams,
  ];
}
