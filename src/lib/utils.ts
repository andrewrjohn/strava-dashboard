import { format } from 'date-fns'

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentMonthName() {
  const date = new Date()
  const month = date.toLocaleString('default', { month: 'long' })
  return month
}

export function convertWeekNumberToDateRange(weekNumber: number) {
  const today = new Date()
  const currentYear = today.getFullYear()
  const firstDayOfYear = new Date(currentYear, 0, 0)
  const weekNumberDate = new Date(
    firstDayOfYear.setDate(firstDayOfYear.getDate() + (weekNumber - 1) * 7),
  )
  const weekEndDate = new Date(
    firstDayOfYear.setDate(firstDayOfYear.getDate() + 6),
  )
  return `${weekNumberDate.getMonth() + 1}/${weekNumberDate.getDate()}/${weekNumberDate.getFullYear()} - ${weekEndDate.getMonth() + 1}/${weekEndDate.getDate()}/${weekEndDate.getFullYear()}`
}

export const getCurrentWeekNumber = () => Number(format(new Date(), 'w'))
export const getCurrentWeekRange = () =>
  convertWeekNumberToDateRange(getCurrentWeekNumber())
