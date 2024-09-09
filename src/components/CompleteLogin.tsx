'use client'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { completeLogin } from '@/app/actions'
import { Loader2Icon } from 'lucide-react'

export default function CompleteLogin({ code }: { code: string }) {
  useEffect(() => {
    setTimeout(() => {
      completeLogin(code)
    }, 3000)
  }, [])

  return (
    <div className="flex items-center justify-center gap-1.5">
      Logging in... <Loader2Icon className="animate-spin" />
    </div>
  )
}
