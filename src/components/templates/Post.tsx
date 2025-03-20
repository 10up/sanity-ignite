import Byline from '@/components/modules/Byline';
import CoverImage from '@/components/modules/CoverImage';
import CustomPortableText from '@/components/modules/PortableText';
import { PostFragmentType } from '@/lib/sanity/queries/fragments/PostFragment';
import type { PortableTextBlock } from 'next-sanity';
import React from 'react';

type Props = {
  post: PostFragmentType;
};

const Post = ({ post }: Props) => {
  return (
    <div className="container mx-auto max-w-5xl pt-5 md:pt-8 pb-12">
      {/* {post.image?.asset?._ref ? (
        <div className="mb-6 md:mb-14">
          <CoverImage image={post.image} priority />
        </div>
      ) : null} */}
      <h1 className="text-3xl md:text-5xl font-bold mb-6">{post.title}</h1>
      {post.author ? (
        <div className="mb-6">
          <Byline author={post.author} />
        </div>
      ) : null}

      <CustomPortableText value={post.content as PortableTextBlock[]} />
      <pre>{JSON.stringify(post.content, null, 2)}</pre>
    </div>
  );
};

export default Post;
