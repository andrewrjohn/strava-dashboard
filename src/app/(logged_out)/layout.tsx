import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import Image from 'next/image'
import PoweredByStrava from '@/images/api_logo_pwrdBy_strava_horiz_gray.svg'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Run Hub',
  description: 'See your Strava running stats all in one place.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="antialiased dark">
      <body
        className={`${inter.className} dark:bg-background dark:text-foreground min-h-screen flex flex-col`}
      >
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="flex justify-center py-4">
          <Image src={PoweredByStrava} alt="Powered by Strava" height={30} />
        </footer>
      </body>
    </html>
  )
}
