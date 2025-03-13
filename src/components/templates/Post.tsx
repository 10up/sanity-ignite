import Byline from '@/components/Byline';
import CoverImage from '@/components/CoverImage';
import CustomPortableText from '@/components/PortableText';
import { PostQueryResult } from '@/sanity.types';
import type { PortableTextBlock } from 'next-sanity';
import React from 'react';

type Props = {
  post: NonNullable<PostQueryResult>;
};

const Post = ({ post }: Props) => {
  return (
    <div className="container mx-auto py-12">
      {post.image?.asset?._ref ? (
        <div className="mb-6 md:mb-14">
          <CoverImage image={post.image} priority />
        </div>
      ) : null}
      <h1 className="text-5xl md:text-7xl font-bold mb-6">{post.title}</h1>
      {post.author ? (
        <div className="mb-6">
          <Byline post={post} />
        </div>
      ) : null}

      <CustomPortableText value={post.content as PortableTextBlock[]} />
    </div>
  );
};

export default Post;
