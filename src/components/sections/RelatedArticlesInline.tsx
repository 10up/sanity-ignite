import Link from 'next/link';
import { Image } from 'next-sanity/image';
import { getDocumentLink } from '@/lib/links';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { ArticleCardFragmentType } from '@/lib/sanity/queries/schemas';

export const RelatedArticlesInline = ({
  articles,
}: {
  articles: ArticleCardFragmentType[];
}) => {
  if (!articles || articles.length === 0) return null;
  return (
    <aside
      aria-labelledby="related-stories-heading"
      className="my-8 bg-paper rounded-lg p-4"
    >
      <h4
        id="related-stories-heading"
        className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wide text-ink mb-4"
      >
        <span aria-hidden className="h-4 w-1 shrink-0 rounded-sm bg-purple" />
        Related Stories
      </h4>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <li key={article._id}>
            <Link
              href={getDocumentLink({ _type: 'article', slug: article.slug })}
              className="flex gap-3 items-center"
              prefetch={false}
            >
              <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-purple-soft">
                {article.image && (
                  <Image
                    src={
                      urlForImage(article.image)
                        ?.width(128)
                        .height(128)
                        .url() as string
                    }
                    alt={article.image?.alt ?? ''}
                    fill
                    className="object-cover"
                    sizes="64px"
                    loading="lazy"
                  />
                )}
              </div>
              <div>
                {article.categories?.[0] && (
                  <div className="text-xxs font-bold tracking-wider uppercase text-purple">
                    {article.categories[0].title}
                  </div>
                )}
                <div className="font-medium text-sm leading-snug text-ink hover:underline hover:text-ink/80 transition-colors">
                  {article.title}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
