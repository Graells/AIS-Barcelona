'use client';

import { cn } from '@/app/utils/tailwindUtils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitch from '../theme/ThemeSwitch';

const links = [
  { name: 'Home', href: '/', icon: null },
  { name: 'About', href: '/about', icon: null },
  { name: 'Documentation', href: '/documentation', icon: null },
];

function NavBar() {
  const pathname = usePathname();
  const isActiveLink = (linkHref: string, pathname: string) => {
    if (pathname === linkHref) {
      return true;
    }
    const regex = new RegExp(`^${linkHref}/page/`);
    return regex.test(pathname);
  };

  return (
    <nav className="flex h-20 items-center justify-center">
      <ul className="flex flex-row  gap-5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'flex h-[40px] items-center justify-center gap-2 rounded-xl border-2 border-black p-2 text-sm font-medium hover:bg-slate-200 md:px-2 dark:border-white  dark:hover:bg-slate-600',
                {
                  'bg-slate-200 dark:bg-slate-600': isActiveLink(
                    link.href,
                    pathname,
                  ),
                },
              )}
            >
              {link.name}
            </Link>
          </li>
        ))}
        <div className="ml-1 h-[38px] w-[2px] bg-black dark:bg-white  "></div>
        <div className=" flex items-center justify-center">
          <ThemeSwitch />
        </div>
      </ul>
    </nav>
  );
}

export default NavBar;
