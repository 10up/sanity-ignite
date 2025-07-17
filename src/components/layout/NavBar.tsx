'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/NavigationMenu';
import { getLinkByLinkObject } from '@/lib/links';
import { cn } from '@/lib/utils';
import type { SettingsQueryResult } from '@/sanity.types';
import { Button } from '../ui/Button';

export default function NavBar({
  menuItems,
}: {
  menuItems: NonNullable<NonNullable<SettingsQueryResult>['menu']>;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-end flex-1">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <NavigationMenu>
          <NavigationMenuList>
            {menuItems.map((item) => (
              <NavigationMenuItem key={item._key}>
                {item.childMenu ? (
                  // Dropdown menu for items with children
                  <>
                    <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle())}>
                      {item.text}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-1 w-[200px]">
                        {item.childMenu.map((child) => (
                          <NavigationMenuLink key={child._key} asChild>
                            <Link
                              href={child.link ? getLinkByLinkObject(child.link) || '#' : '#'}
                              className="block p-2 hover:bg-gray-100 rounded-md"
                              {...(child.link?.openInNewTab
                                ? {
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                  }
                                : {})}
                            >
                              {child.text}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  // Simple link for items without children
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.link ? getLinkByLinkObject(item.link) || '#' : '#'}
                      className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}
                      {...(item.link?.openInNewTab
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {item.text}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex space-x-2">
          <Button asChild variant="default">
            <Link href={'/'}>Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={'/'}>Log In</Link>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="md:hidden text-gray-800"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out origin-top',
          isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0',
        )}
      >
        <div className="px-4 py-2">
          {menuItems.map((item) => (
            <div key={item._key}>
              {item.childMenu ? (
                // Parent item with children
                <>
                  <div className="py-2 px-4 font-medium">{item.text}</div>
                  <div className="pl-4">
                    {item.childMenu.map((child) => (
                      <Link
                        key={child._key}
                        href={child.link ? getLinkByLinkObject(child.link) || '#' : '#'}
                        className="block py-2 px-4 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                        {...(child.link?.openInNewTab
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {child.text}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                // Single menu item
                <Link
                  href={item.link ? getLinkByLinkObject(item.link) || '#' : '#'}
                  className="block py-2 px-4 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                  {...(item.link?.openInNewTab
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {item.text}
                </Link>
              )}
            </div>
          ))}
          <div className="flex flex-col space-y-2 mt-4 p-4">
            <Button asChild variant="default">
              <Link href={'/'}>Get Started</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={'/'}>Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
