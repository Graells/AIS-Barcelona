'use client';

import { cn } from '@/app/utils/tailwindUtils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitch from '../theme/ThemeSwitch';

const links = [
  { name: 'Home', href: '/', icon: null },
  { name: 'Database', href: '/database', icon: null },
  { name: 'About', href: '/about', icon: null },
];

export default function NavBar() {
  const pathname = usePathname();
  const isActiveLink = (linkHref: string, pathname: string) => {
    if (pathname === linkHref) {
      return true;
    }
    const regex = new RegExp(`^${linkHref}/page/`);
    return regex.test(pathname);
  };

  return (
    <nav className="mt-3 flex flex-col items-center justify-center">
      <ul className="flex flex-row  gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'flex h-[35px] items-center justify-center gap-2 rounded border-2 border-black p-2 text-sm font-bold hover:bg-slate-200 dark:border-white dark:hover:bg-slate-600  md:px-2',
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
      <div className="md:w-[1100px]">
        <h1 className="ml-2 text-center text-xl font-black text-sky-500 md:mb-3 md:mt-2">
          Monitoring of Vessels Within{' '}
          <Link className="underline" href="/fnb">
            FNB
          </Link>
          &apos;s Radius
        </h1>
      </div>
    </nav>
  );
}
