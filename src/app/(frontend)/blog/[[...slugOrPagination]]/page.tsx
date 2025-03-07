import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { postQuery, postsArchiveQuery } from '@/sanity/queries/queries';
import { parseUrlParams } from '@/lib/parseUrlParams';
import PostRoute from './PostRoute';
import PostListingRoute from './PostListingRoute';

const POSTS_PER_PAGE = 10;

type Props = {
  params: Promise<{ slugOrPagination: string[] | undefined }>;
};

const loadData = async (props: Props) => {
  const params = await props.params;

  const parsedUrlParams = parseUrlParams(params.slugOrPagination);

  if (!parsedUrlParams) {
    notFound();
  }

  if ('slug' in parsedUrlParams) {
    const { data: post } = await sanityFetch({
      query: postQuery,
      params: { slug: parsedUrlParams.slug },
    });

    return { post };
  }

  const { page } = parsedUrlParams;

  const from = (page - 1) * POSTS_PER_PAGE;
  const to = page * POSTS_PER_PAGE;

  const { data } = await sanityFetch({
    query: postsArchiveQuery,
    params: { from, to },
  });

  return {
    archive: data,
    currentPage: page,
  };
};

// export async function generateMetadata(props: Props): Promise<Metadata> {
//   const params = await props.params;
//   const { data: post } = await sanityFetch({
//     query: postQuery,
//     params,
//     stega: false,
//   });

//   if (!post?.seo) {
//     return {};
//   }

//   return formatMetaData(post.seo as unknown as SeoType);
// }

export default async function PostPage(props: Props) {
  const data = await loadData(props);

  if (data.post) {
    return <PostRoute post={data.post} />;
  }

  if (data.archive) {
    const totalPages = Math.ceil(data.archive.total / POSTS_PER_PAGE);

    return (
      <PostListingRoute
        listingData={data.archive}
        currentPage={data.currentPage}
        totalPages={totalPages}
      />
    );
  }

  notFound();
}
