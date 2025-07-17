import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Page from '@/components/templates/Page';
import PersonArchiveByline from '@/components/templates/PersonArchiveByline';
import PostRiver from '@/components/templates/PostRiver';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { getDocumentLink } from '@/lib/links';
import { paginatedData } from '@/lib/pagination';
import { sanityFetch } from '@/lib/sanity/client/live';
import { personQuery, postsArchiveQuery } from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ personSlug: string; page: string }>;
};

const loadData = async (props: Props) => {
  const { page, personSlug } = await props.params;

  const pageNumber = parseInt(page, 10);

  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    return null;
  }

  const from = (pageNumber - 1) * POSTS_PER_PAGE;
  const to = pageNumber * POSTS_PER_PAGE - 1;

  const [{ data: archiveData }, { data: personData }] = await Promise.all([
    sanityFetch({
      query: postsArchiveQuery,
      params: { from, to, filters: { personSlug } },
    }),
    sanityFetch({
      query: personQuery,
      params: { slug: personSlug },
    }),
  ]);

  return {
    person: personData,
    posts: paginatedData(archiveData, pageNumber, POSTS_PER_PAGE),
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { posts, person } = (await loadData(props)) || {};

  const { currentPage = 1 } = posts || {};

  if (!person) {
    return notFound();
  }

  return {
    title:
      currentPage === 1
        ? `Author ${person.firstName} ${person.lastName} `
        : `Author ${person.firstName} ${person.lastName} - Page ${currentPage}`,
    alternates: {
      canonical: getDocumentLink(person, true),
    },
  };
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  return [];
}

export default async function PostPage(props: Props) {
  const { posts, person } = (await loadData(props)) || {};

  if (!person || !posts) {
    notFound();
  }

  return (
    <Page>
      <PersonArchiveByline person={person} />
      <PostRiver
        listingData={posts.data}
        currentPage={posts.currentPage}
        totalPages={posts.totalPages}
        paginationBase={`/author/${person.slug}`}
      />
    </Page>
  );
}
