'use client'
import React from 'react'
import { Button } from '@/components-temp/ui/button'
import { completeLogin } from '@/app/actions'

export default function FinishLoginButton({ code }: { code: string }) {
  return <Button onClick={() => completeLogin(code)}>Finish Login</Button>
}
