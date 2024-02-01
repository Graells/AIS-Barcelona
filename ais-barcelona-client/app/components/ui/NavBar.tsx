'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Home', href: '/', icon: null },
  { name: 'About', href: '/about', icon: null },
  { name: 'Documentation', href: '/documentation', icon: null },
];

function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-20 items-center justify-center">
      <ul className="flex flex-row  gap-5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavBar;
