'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import './globals.css'
import { FrownIcon } from 'lucide-react'
import { logout } from '../lib/strava'

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
      <p className="mt-4">
        If the problem persists, please try{' '}
        <button
          onClick={() => {
            try {
              logout()
            } catch (e) {
              console.error(e)
            }
          }}
          className="underline"
        >
          logging out
        </button>{' '}
        and logging back in.
      </p>
    </div>
  )
}
