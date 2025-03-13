import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { postPagesSlugs, postQuery } from '@/sanity/queries/queries';
import PostRoute from '../PostRoute';
import { PostQueryResult } from '@/sanity.types';
import { Metadata } from 'next';
import { getDocumentLink } from '@/lib/links';
import { client } from '@/sanity/lib/client';
import { serverEnv } from '@/env/serverEnv';
import { formatMetaData } from '@/sanity/lib/seo';
import { SeoType } from '@/types/seo';

type Props = {
  params: Promise<{ slug: string }>;
};

const loadData = async (props: Props): Promise<PostQueryResult> => {
  const { slug } = await props.params;

  const { data: post } = await sanityFetch({
    query: postQuery,
    params: { slug },
  });

  return post;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const routeData = await loadData(props);

  if (!routeData) {
    return {};
  }

  return {
    alternates: {
      canonical: getDocumentLink(routeData, true),
    },
  };
}

export default async function PostPage(props: Props) {
  const routeData = await loadData(props);

  if (!routeData) {
    notFound();
  }

  return <PostRoute post={routeData} />;
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const slugs = await client.fetch(postPagesSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });

  const staticParams = slugs
    ? slugs.filter((slug) => slug !== null).map((slug) => ({ slug: slug }))
    : [];

  return [...staticParams];
}
