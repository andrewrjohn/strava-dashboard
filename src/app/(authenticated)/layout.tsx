import { NavLinks } from '@/components/NavLinks'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PoweredByStrava from '@/images/api_logo_pwrdBy_strava_horiz_gray.svg'
import { getAthleteId } from '@/lib/cookies'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getAthlete } from '../actions'
import LogoutButton from '@/components/LogoutButton'
import { FooterImage } from '@/components/FooterImage'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookie = getAthleteId()

  if (!cookie) {
    redirect('/login')
  }

  const athlete = await getAthlete()

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex h-screen flex-col border-r bg-muted/10">
        <div className="flex h-14 items-center border-b px-6">
          <h1 className="text-xl font-bold sr-only md:not-sr-only">Run Hub</h1>
          <h1 className="text-xl font-bold md:hidden block">RH</h1>
        </div>
        <NavLinks />
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

      <div className="md:px-7 px-4 py-3 md:py-6 flex flex-col flex-1 overflow-y-scroll w-full">
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="flex justify-center mt-10">
          <FooterImage />
        </footer>
      </div>
    </div>
  )
}
