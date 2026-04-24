import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-7 py-6 tracking-wide">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-extrabold text-lg tracking-tight"
          >
            <span className="mr-0 inline-block text-sm">🔥</span>
            Ignite for Sanity
          </Link>
        </div>
        <div className="shrink-0 text-paper/75 text-sm">
          Built with Sanity + Next.js by{' '}
          <Link
            href="https://fueled.com"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            className="font-bold text-purple hover:underline"
          >
            Fueled
          </Link>
        </div>
      </div>
    </footer>
  );
};
