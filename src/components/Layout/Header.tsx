import Link from 'next/link';
import { sanityFetch } from '@/sanity/lib/live';
import { settingsQuery } from '@/sanity/queries/queries';
import { Button } from '../ui/button';
import Logo from '../icons/Logo';
export default async function Header() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
  });

  if (!settings) {
    return null;
  }

  return (
    <header className="inset-0 bg-white/80 flex items-center">
      <div className="container py-6 mx-auto">
        <div className="flex items-center justify-between gap-5">
          {typeof settings.title !== undefined && (
            <Link className="flex items-center space-x-4" href="/">
              <Logo />
              <span className="text-2xl font-bold">{settings.title}</span>
            </Link>
          )}

          <nav className="hidden md:flex items-center space-x-6">
            <ul className="flex space-x-4">
              {settings.menuItems &&
                // @ts-expect-error Fix later
                settings.menuItems.map((item) => {
                  let href = '/';

                  if (item._type === 'page') {
                    href = `/${item.slug?.current}`;
                  }

                  return (
                    <li key={item._id}>
                      <Link href={href} className="hover:text-gray-600 transition-colorse">
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
            </ul>
            <div className="flex space-x-2">
              <Button asChild variant="default">
                <Link href={'/'}>Get Started</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={'/'}>Log In</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
