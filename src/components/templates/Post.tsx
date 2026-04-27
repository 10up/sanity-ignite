import type { PortableTextBlock } from 'next-sanity';
import CustomPortableText from '@/components/modules/BlockContent';
import Byline from '@/components/modules/Byline';
import CoverImage from '@/components/modules/CoverImage';
import type { ArticleFragmentType } from '@/lib/sanity/queries/schemas';

type Props = {
  post: ArticleFragmentType;
};

const Post = ({ post }: Props) => {
  return (
    <div className="container mx-auto max-w-5xl pt-5 md:pt-8 pb-12">
      {post.image?.asset?._ref ? (
        <div className="mb-6 md:mb-14">
          <CoverImage
            image={post.image}
            preload
            sizes="(min-width: 1024px) 944px, calc(100vw - 5rem)"
          />
        </div>
      ) : null}
      <h1 className="text-3xl md:text-5xl font-bold mb-6">{post.title}</h1>
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
