import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import Post from '@/components/templates/Post';
import { serverEnv } from '@/env/serverEnv';
import { getDocumentLink } from '@/lib/links';
import { client } from '@/lib/sanity/client/client';
import { CACHE_PROFILES, sanityFetch } from '@/lib/sanity/client/fetch';
import { postPagesSlugs, postQuery } from '@/lib/sanity/queries/queries';
import { postSchema } from '@/lib/sanity/queries/schemas';

type Props = {
  params: Promise<{ slug: string }>;
};

const fetchPost = async (slug: string) =>
  sanityFetch({
    query: postQuery,
    params: { slug },
    schema: postSchema,
    cache: {
      profile: 'days',
      tags: [`sanity:slug:${slug}`],
    },
  });

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await fetchPost(slug);

  if (!post) {
    return {};
  }

  return {
    alternates: {
      canonical: getDocumentLink(post, true),
    },
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch(postPagesSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });

  return slugs
    ? slugs
        .filter((slug: string | null) => slug !== null)
        .map((slug: string | null) => ({ slug }))
    : [];
}

export default async function PostPage(props: Props) {
  'use cache';

  const { slug } = await props.params;
  const post = await fetchPost(slug);

  if (!post) {
    notFound();
  }
  cacheTag(`sanity:slug:${slug}`);
  cacheLife(CACHE_PROFILES.days);

  return <Post post={post} />;
}
