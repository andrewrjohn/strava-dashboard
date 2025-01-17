'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  BarChartIcon,
  CalendarIcon,
  FootprintsIcon,
  HomeIcon,
  LucideIcon,
} from 'lucide-react'

const routes = [
  {
    label: 'Overview',
    icon: HomeIcon,
    href: '/',
  },
  {
    label: 'Training Log',
    icon: CalendarIcon,
    href: '/training-log',
  },
  {
    label: 'Stats',
    icon: BarChartIcon,
    href: '/stats',
  },
  {
    label: 'Gear',
    icon: FootprintsIcon,
    href: '/gear',
  },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex-1 space-y-1 p-3">
      {routes.map(({ label, href, icon: Icon }) => (
        <Button
          key={href}
          variant={pathname === href ? 'secondary' : 'ghost'}
          className={cn(
            'md:w-full flex justify-center md:justify-start md:gap-2',
          )}
          asChild
        >
          <Link href={href}>
            <Icon className="h-4 w-4" />
            <span className="hidden md:inline">{label}</span>
          </Link>
        </Button>
      ))}
    </div>
  )
}
