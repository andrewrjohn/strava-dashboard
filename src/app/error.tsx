'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { FrownIcon } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center max-w-sm mx-auto">
      <h2 className="font-bold text-2xl flex items-center gap-2">
        Something went wrong <FrownIcon />
      </h2>
      <p>{error.message}</p>
      <Button onClick={() => reset()} className="mt-6">
        Try again
      </Button>
    </div>
  )
}
