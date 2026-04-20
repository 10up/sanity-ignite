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
import { sanityFetch } from '@/lib/sanity/client/fetch';
import {
  personQuery,
  personSlugs,
  postsArchiveQuery,
} from '@/lib/sanity/queries/queries';
import { personSchema, postsArchiveSchema } from '@/lib/sanity/queries/schemas';

type Props = {
  params: Promise<{ personSlug: string }>;
};

const loadData = async (props: Props) => {
  const { personSlug } = await props.params;

  const [posts, person] = await Promise.all([
    sanityFetch({
      query: postsArchiveQuery,
      params: { from: 0, to: POSTS_PER_PAGE - 1, filters: { personSlug } },
      schema: postsArchiveSchema,
      cache: {
        profile: 'hours',
        tags: ['sanity:type:post', `sanity:slug:${personSlug}`],
      },
    }),
    sanityFetch({
      query: personQuery,
      params: { slug: personSlug },
      schema: personSchema,
      cache: {
        profile: 'hours',
        tags: ['sanity:type:person', `sanity:slug:${personSlug}`],
      },
    }),
  ]);

  return {
    person,
    posts: posts ? paginatedData(posts, 1, POSTS_PER_PAGE) : null,
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { person } = await loadData(props);

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

export async function generateStaticParams() {
  const slugs = await client.fetch(personSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });

  return slugs
    ? slugs
        .filter((slug: string | null) => slug !== null)
        .map((slug: string | null) => ({
          personSlug: slug,
          pagination: undefined,
        }))
    : [];
}

export default async function PostPage(props: Props) {
  const { posts, person } = await loadData(props);

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
