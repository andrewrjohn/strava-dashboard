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

export function convertWeekNumberToDateRange(year: number, weekNumber: number) {
  const firstDayOfYear = new Date(year, 0, 0)

  // Offset handles if the first day of the year is not on a Sunday
  // Otherwise all weeks will be off
  const dayOffset = firstDayOfYear.getDay()

  const weekStartDayOfYear = (weekNumber - 1) * 7 - dayOffset
  const weekStartDate = new Date(year, 0, weekStartDayOfYear)

  const weekEndDate = new Date(
    weekStartDate.getFullYear(),
    weekStartDate.getMonth(),
    weekStartDate.getDate() + 6,
  )

  const startMonth = weekStartDate.getMonth() + 1
  const startDay = weekStartDate.getDate()
  const startYear = weekStartDate.getFullYear()

  const endMonth = weekEndDate.getMonth() + 1
  const endDay = weekEndDate.getDate()
  const endYear = weekEndDate.getFullYear()

  return `${startMonth}/${startDay}/${startYear} - ${endMonth}/${endDay}/${endYear}`
}

export const getCurrentWeekNumber = () => Number(format(new Date(), 'w'))
export const getCurrentWeekRange = () =>
  convertWeekNumberToDateRange(new Date().getFullYear(), getCurrentWeekNumber())

export const getStravaProfileUrl = (id: number) =>
  `https://www.strava.com/athletes/${id}`
