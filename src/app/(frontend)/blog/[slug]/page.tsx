import { notFound } from 'next/navigation';
import { postPagesSlugs } from '@/lib/sanity/queries/queries';
import Post from '@/components/templates/Post';
import { Metadata } from 'next';
import { getDocumentLink } from '@/lib/links';
import { client } from '@/lib/sanity/client/client';
import { serverEnv } from '@/env/serverEnv';
import { typedSanityFetch } from '@/lib/sanity/queries/queryBuilder';
import { postBySlug } from '@/lib/sanity/queries/postQuery';

type Props = {
  params: Promise<{ slug: string }>;
};

const loadData = async (props: Props) => {
  const { slug } = await props.params;
  const post = await typedSanityFetch(postBySlug, {
    parameters: {
      slug: slug,
    },
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

export default async function PostPage(props: Props) {
  const post = await loadData(props);

  if (!post) {
    notFound();
  }

  // return <pre>{JSON.stringify(post, null, 2)}</pre>;

  return <Post post={post} />;
}
