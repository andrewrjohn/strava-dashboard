import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">Page not found</p>
      <Link href="/" className="text-sm mt-4 flex items-center gap-2">
        <ArrowLeftIcon className="h-4 w-4" />
        Go to home
      </Link>
    </div>
  )
}
