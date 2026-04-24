import Link from 'next/link';

export const Banner = () => {
  return (
    <div className="bg-primary py-4 text-center font-sans text-xs text-primary-foreground">
      <span className="mr-1.5 inline-block">👉</span>
      <span className="text-primary-foreground">
        This is a technical demo of{' '}
      </span>
      <strong className="font-bold text-primary-foreground">
        Ignite for Sanity v2
      </strong>
      <span className="text-primary-foreground">
        {' '}
        - a Sanity.io + Next.js starter kit by{' '}
      </span>
      <Link
        className="font-bold text-primary-foreground hover:underline"
        prefetch={false}
        href="https://www.fueled.com"
        target="_blank"
      >
        Fueled
      </Link>
      <span className="text-primary-foreground">. </span>
      Visit{' '}
      <Link
        className="font-semibold text-primary-foreground underline underline-offset-[3px]"
        prefetch={false}
        href="https://www.fueled.com"
        target="_blank"
      >
        fueled.com
      </Link>
      <span className="text-primary-foreground/88">
        {' '}
        to learn more about our work and services
      </span>
    </div>
  );
};
