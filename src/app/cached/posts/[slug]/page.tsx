import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityCachedFetch } from '@/sanity/lib/cached';
import { postPagesSlugsQuery, postQuery } from '@/sanity/queries/queries';
import { formatMetaData } from '@/sanity/lib/seo';
import { SeoType } from '@/types/seo';
import { client } from '@/sanity/lib/client';

type Props = {
  params: Promise<{ slug: string }>;
};

// Create individual post pages ahead of time on the next deployment with guaranteed fresh data directly from the Sanity API.
export async function generateStaticParams() {
  const slugs = await client.withConfig({ useCdn: false }).fetch(postPagesSlugsQuery);

  return slugs;
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  // TODO: improve sanityCachedFetch params and set stega to false
  const { data: post } = await sanityCachedFetch({
    query: postQuery,
    params,
    tags: [`post`, `post:${params.slug}`],
  });

  if (!post?.seo) {
    return {};
  }

  return formatMetaData(post.seo as unknown as SeoType);
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const { data: post } = await sanityCachedFetch({
    query: postQuery,
    params,
    tags: [`post`, `post:${params.slug}`],
  });

  if (!post?._id) {
    return notFound();
  }

  return <h1>{post.title}</h1>;
}
