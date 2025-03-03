import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { postQuery } from '@/sanity/queries/queries';
import { formatMetaData } from '@/sanity/lib/seo';
import { SeoType } from '@/types/seo';
import CustomPortableText from '@/components/PortableText';
import Avatar from '@/components/Avatar';
import CoverImage from '@/components/CoverImage';
import { type PortableTextBlock } from 'next-sanity';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { data: post } = await sanityFetch({
    query: postQuery,
    params,
    stega: false,
  });

  if (!post?.seo) {
    return {};
  }

  return formatMetaData(post.seo as unknown as SeoType);
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const { data: post } = await sanityFetch({ query: postQuery, params });

  if (!post?._id) {
    return notFound();
  }

  return (
    <main className="max-w-7xl mx-auto">
      <section className="container mx-auto py-16 md:py-24">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">{post.title}</h1>
        {post.author ? (
          <div className="mb-6">
            <Avatar person={post.author} date={post.date} />
          </div>
        ) : null}
        {post.image?.asset?._ref ? (
          <div className="mb-6 md:mb-12">
            <CoverImage image={post.image} priority />
          </div>
        ) : null}
        <CustomPortableText value={post.content as PortableTextBlock[]} className="max-w-6xl" />
      </section>
    </main>
  );
}
