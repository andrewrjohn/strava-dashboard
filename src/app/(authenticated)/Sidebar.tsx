'use client'

import LogoutButton from '@/components/LogoutButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DetailedAthlete } from '@/types/interfaces'
import {
  BarChartIcon,
  CalendarIcon,
  FootprintsIcon,
  HomeIcon,
  MapIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
    label: 'Map',
    icon: MapIcon,
    href: '/map',
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

interface Props {
  athlete: DetailedAthlete
}

export function Sidebar(props: Props) {
  const { athlete } = props

  const pathname = usePathname()

  return (
    <div className="flex flex-col h-[100dvh] border-r bg-muted/10">
      <div className="flex h-14 items-center border-b px-6">
        <h1 className="text-xl font-bold sr-only md:not-sr-only">Run Hub</h1>
        <h1 className="text-xl font-bold md:hidden block">RH</h1>
      </div>
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
      <div className="border-t p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <Avatar>
            <AvatarImage src={athlete.profile} />
            <AvatarFallback>
              {athlete.firstname.charAt(0)}
              {athlete.lastname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium hidden md:block">
              {athlete.firstname} {athlete.lastname}
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}
