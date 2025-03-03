import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { postQuery } from '@/sanity/queries/queries';
import { formatMetaData } from '@/sanity/lib/seo';
import { SeoType } from '@/types/seo';
import CustomPortableText from '@/components/PortableText';
import { Image } from 'next-sanity/image';
import { urlForImage } from '@/sanity/lib/utils';
import Avatar from '@/components/Avatar';

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
          <Image
            alt={post.image?.alt || ''}
            className="shadow-md rounded-4xl mb-6 md:mb-12"
            width="2000"
            height="1000"
            src={urlForImage(post.image)?.width(2000).height(1000).url() as string}
          />
        ) : null}
        <CustomPortableText value={post.content} />
      </section>
    </main>
  );
}
