'use client'
import { logout } from '@/app/actions'
import React, { forwardRef } from 'react'

const LogoutButton = forwardRef<HTMLButtonElement>((_, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        try {
          logout()
        } catch (error) {
          console.error(error)
        }
      }}
    >
      Log Out
    </button>
  )
})

export default LogoutButton
