import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Strava Hub',
  description: 'See your Strava running stats all in one place.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="antialiased dark container">
      <body
        className={`${inter.className} dark:bg-background dark:text-foreground min-h-full flex flex-col`}
      >
        {children}
      </body>
    </html>
  )
}
