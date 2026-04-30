'use client';

import { useQueryStates } from 'nuqs';
import type { z } from 'zod';
import type { categorySchema } from '@/lib/sanity/queries/schemas';
import { blogSearchParams } from './searchParams';

export const BlogFiltersClient = ({
  categories,
}: {
  categories: z.infer<typeof categorySchema>[];
}) => {
  const [filters, setFilters] = useQueryStates(blogSearchParams, {
    shallow: false,
  });
  return (
    <>
      <input
        type="search"
        placeholder="Search posts…"
        value={filters.search ?? ''}
        onChange={(e) =>
          setFilters({ search: e.target.value || null, page: 1 })
        }
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
      />

      <select
        value={filters.category ?? ''}
        onChange={(e) =>
          setFilters({ category: e.target.value || null, page: 1 })
        }
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.slug ?? ''}>
            {cat.title}
          </option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(e) =>
          setFilters({
            sort: e.target.value as 'recent' | 'oldest',
            page: 1,
          })
        }
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        <option value="recent">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
    </>
  );
};
