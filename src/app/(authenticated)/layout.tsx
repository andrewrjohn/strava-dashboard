import { FooterImage } from '@/components/FooterImage'
import { getCurrentAthleteId } from '@/lib/cookies'
import { redirect } from 'next/navigation'
import { getActivities, getAthlete } from '../../lib/strava'
import { Sidebar } from './Sidebar'
import { getCurrentStreak } from '@/lib/activities'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookie = getCurrentAthleteId()

  if (!cookie) {
    redirect('/login')
  }

  const allActivities = await getActivities()

  const activities = allActivities.filter((a) =>
    a.sport_type.toLowerCase().includes('run'),
  )

  const athlete = await getAthlete()
  const currentStreak = getCurrentStreak(activities)

  return (
    <div className="flex h-[100dvh]">
      <Sidebar athlete={athlete} currentStreak={currentStreak} />

      <div className="md:px-7 px-4 py-3 md:py-6 flex flex-col flex-1 overflow-y-scroll w-full">
        <div className="flex-1 flex flex-col max-w-screen-xl">{children}</div>
        <footer className="flex justify-center mt-10">
          <FooterImage />
        </footer>
      </div>
    </div>
  )
}
