import { sanityFetch } from '@/sanity/lib/live';
import { allPostsQuery } from '@/sanity/queries/queries';
import { Post as PostType } from '@/sanity.types';
import Post from '@/components/Post';

export default async function Posts() {
  const { data: posts } = await sanityFetch({ query: allPostsQuery });

  if (!posts) {
    return null;
  }

  return (
    <div>
      {posts.map((post: PostType) => {
        if (post) {
          return <Post key={post._id} post={post} />;
        }
      })}
    </div>
  );
}
