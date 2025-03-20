import { top10ProductsQuery } from '@/lib/sanity/queries/postQuery';
import { runQuery } from '@/lib/sanity/queries/queryBuilder';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const products = await runQuery(top10ProductsQuery);

  return NextResponse.json({
    data: {
      products,
    },
  });
};
