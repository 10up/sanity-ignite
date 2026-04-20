'use client';

import { useQueryStates } from 'nuqs';
import { blogSearchParams } from './searchParams';

type Category = {
  _id: string;
  title?: string | null;
  slug: string | null;
};

export function BlogFilters({ categories }: { categories: Category[] }) {
  const [filters, setFilters] = useQueryStates(blogSearchParams, {
    shallow: false,
  });

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
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
    </div>
  );
}
