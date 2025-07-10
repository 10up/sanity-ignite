import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Page from '@/components/templates/Page';
import PersonArchiveByline from '@/components/templates/PersonArchiveByline';
import PostRiver from '@/components/templates/PostRiver';
import { serverEnv } from '@/env/serverEnv';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { getDocumentLink } from '@/lib/links';
import { paginatedData } from '@/lib/pagination';
import { client } from '@/lib/sanity/client/client';
import { sanityFetch } from '@/lib/sanity/client/live';
import { personQuery, personSlugs, postsArchiveQuery } from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ personSlug: string }>;
};

const loadData = async (props: Props) => {
  const { personSlug } = await props.params;

  const from = 0;
  const to = POSTS_PER_PAGE - 1;

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
    posts: paginatedData(archiveData, 0, POSTS_PER_PAGE),
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { person } = (await loadData(props)) || {};

  if (!person) {
    return notFound();
  }

  return {
    title: `Author ${person.firstName} ${person.lastName}`,
    alternates: {
      canonical: getDocumentLink(person, true),
    },
  };
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const slugs = await client.fetch(personSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });

  return slugs
    ? slugs
        .filter((slug) => slug !== null)
        .map((slug) => ({ personSlug: slug, pagination: undefined }))
    : [];
}

export default async function PostPage(props: Props) {
  const { posts, person } = (await loadData(props)) || {};

  if (!person) {
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
