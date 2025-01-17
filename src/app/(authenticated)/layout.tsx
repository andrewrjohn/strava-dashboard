import { FooterImage } from '@/components/FooterImage'
import { getAthleteId } from '@/lib/cookies'
import { redirect } from 'next/navigation'
import { getAthlete } from '../actions'
import { Sidebar } from './Sidebar'

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
      <Sidebar athlete={athlete} />

      <div className="md:px-7 px-4 py-3 md:py-6 flex flex-col flex-1 overflow-y-scroll w-full">
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="flex justify-center mt-10">
          <FooterImage />
        </footer>
      </div>
    </div>
  )
}
