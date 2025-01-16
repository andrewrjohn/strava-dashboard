'use client'
import { logout } from '@/app/actions'
import { LogOutIcon } from 'lucide-react'
import React, { forwardRef } from 'react'

const LogoutButton = forwardRef<HTMLButtonElement>((_, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className="text-xs text-muted-foreground text-left"
      onClick={() => {
        try {
          logout()
        } catch (error) {
          console.error(error)
        }
      }}
    >
      <span className="hidden md:block">Log Out</span>
      <LogOutIcon className="h-4 w-4 md:hidden" />
    </button>
  )
})

export default LogoutButton
