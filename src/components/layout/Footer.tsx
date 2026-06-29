import Image from 'next/image';
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
            <Image
              src="/fueled_planet@2x.png"
              alt="Ignite for Sanity"
              width={32}
              height={32}
              className="mr-0 inline-block text-sm size-8"
              aria-hidden="true"
            />
            Ignite for Sanity{' '}
            <span className="relative overflow-hidden text-xs text-paper font-semibold border border-purple inline-flex items-center justify-center rounded-sm leading-none size-6 bg-purple/30">
              <span aria-hidden="true" className="version-badge-shimmer" />
              <span className="relative z-[1]">v2</span>
            </span>
          </Link>
        </div>
        <div className="shrink-0 text-paper/75 text-sm">
          Built with Sanity + Next.js by{' '}
          <Link
            href="https://fueled.com"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            className="font-semibold text-white hover:underline"
          >
            Fueled
          </Link>
        </div>
      </div>
    </footer>
  );
};
