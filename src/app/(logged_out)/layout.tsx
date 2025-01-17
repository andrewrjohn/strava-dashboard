import { FooterImage } from '@/components/FooterImage'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}

      <footer className="flex justify-center py-4">
        <FooterImage />
      </footer>
    </>
  )
}
