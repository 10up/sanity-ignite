import Link from 'next/link';
import { sanityFetch } from '@/sanity/lib/live';
import { settingsQuery } from '@/sanity/queries/queries';
import Logo from '../Icons/Logo';
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
                settings.menuItems.map((item) => {
                  let href = '/';

                  if (item.isHome) {
                    href = '/';
                  } else if (item._type === 'page') {
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
              <a
                href="#"
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Up
              </a>
              <a
                href="#"
                className="bg-transparent hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 transition-colors"
              >
                Log In
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
