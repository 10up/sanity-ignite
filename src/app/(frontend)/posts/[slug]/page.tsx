import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetch } from '@/sanity/lib/fetch';
import { postQuery } from '@/sanity/queries/queries';
import { formatMetaData } from '@/sanity/lib/seo';
import { SeoType } from '@/types/seo';

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { data: post } = await fetch({
    live: true,
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  });

  if (!post?.seo) {
    return {};
  }

  return formatMetaData(post.seo as unknown as SeoType);
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const { data: post } = await fetch({
    live: true,
    query: postQuery,
    params,
  });

  if (!post?._id) {
    return notFound();
  }

  return <h1>{post.title}</h1>;
}
