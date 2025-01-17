import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../app/globals.css'

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
        className={`${inter.className} dark:bg-background dark:text-foreground min-h-[100dvh] flex flex-col`}
      >
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  )
}
