import Avatar from '@/components/Avatar';
import CoverImage from '@/components/CoverImage';
import CustomPortableText from '@/components/PortableText';
import { PostQueryResult } from '@/sanity.types';
import type { PortableTextBlock } from 'next-sanity';
import React from 'react';

type Props = {
  post: NonNullable<PostQueryResult>;
};

const PostRoute = ({ post }: Props) => {
  return (
    <main className="container mx-auto">
      <section className="py-16 md:py-24">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">{post.title}</h1>
        {post.author ? (
          <div className="mb-6">
            <Avatar person={post.author} date={post.date} />
          </div>
        ) : null}
        {post.image?.asset?._ref ? (
          <div className="mb-6 md:mb-14">
            <CoverImage image={post.image} priority />
          </div>
        ) : null}
        <CustomPortableText
          value={post.content as PortableTextBlock[]}
          className="max-w-5xl mx-auto"
        />
      </section>
    </main>
  );
};

export default PostRoute;
