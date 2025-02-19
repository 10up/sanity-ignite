import Link from 'next/link';
import { settingsQuery } from '@/sanity/queries/queries';
import { fetch } from '@/sanity/lib/fetch';

export default async function Header() {
  const { data: settings } = await fetch({
    live: true,
    query: settingsQuery,
  });

  if (!settings) {
    return null;
  }

  return (
    <header className="fixed z-50 h-24 inset-0 bg-white/80 flex items-center backdrop-blur-lg">
      <div className="container py-6 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          {typeof settings.title !== undefined && (
            <Link className="flex items-center gap-2" href="/">
              <span className="text-lg pl-2 font-semibold">{settings.title}</span>
            </Link>
          )}

          <nav>
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 leading-5 text-sm md:text-base tracking-tight font-normal"
            >
              {settings.menuItems &&
                settings.menuItems.map((item) => {
                  let href = '/';

                  if (item.isHome) {
                    href = '/';
                  } else if (item._type === 'page') {
                    href = `/${item.slug?.current}`;
                  }
                  return (
                    <li key={item._id} className="m-0 p-0">
                      <Link href={href} className="hover:underline">
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
