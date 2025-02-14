import { fetch } from '@/sanity/lib/fetch';
import { allPostsQuery } from '@/sanity/queries/queries';
import { Post as PostType } from '@/sanity.types';
import Post from '@/components/Post';

export default async function Posts() {
  const { data: posts } = await fetch({ live: true, query: allPostsQuery });

  if (!posts) {
    return null;
  }

  return (
    <div>
      {posts.map((post) => {
        if (post) {
          return <Post key={post._id} post={post as unknown as PostType} />;
        }
      })}
    </div>
  );
}
