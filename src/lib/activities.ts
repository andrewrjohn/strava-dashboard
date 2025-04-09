import { convertWeekNumberToDateRange, getCurrentWeekNumber } from '@/lib/utils'
import { SummaryActivity, WeekSummary } from '@/types/interfaces'
import { format, isSameDay, subDays } from 'date-fns'

export function groupActivitiesByWeek(activities: SummaryActivity[]) {
  const sorted = activities.sort(
    (a, b) => +new Date(b.start_date) - +new Date(a.start_date),
  )

  const weekLog: Record<string, WeekSummary> = {}

  const firstActivityYear = new Date(
    sorted[sorted.length - 1].start_date,
  ).getFullYear()

  const currentYear = new Date().getFullYear()

  for (let year = currentYear; year >= firstActivityYear; year--) {
    const date = new Date()
    date.setFullYear(year)
  }

  for (const activity of sorted) {
    const d = new Date(activity.start_date)

    const range = convertWeekNumberToDateRange(
      d.getFullYear(),
      Number(format(d, 'w')),
    )

    if (!weekLog[range]) {
      weekLog[range] = { count: 0, distance: 0, time: 0 }
    }

    weekLog[range].distance += miles(activity.distance)
    weekLog[range].time += activity.moving_time
    weekLog[range].count += 1
  }

  return weekLog
}

export function getCurrentWeekSummary(activities: SummaryActivity[]) {
  const [firstDayOfWeek, lastDayOfWeek] = convertWeekNumberToDateRange(
    new Date().getFullYear(),
    getCurrentWeekNumber(),
  ).split('-')

  const weekActivities = activities.filter(
    (a) =>
      new Date(a.start_date) >= new Date(firstDayOfWeek) &&
      new Date(a.start_date) <= new Date(lastDayOfWeek),
  )

  const weekTotal = weekActivities.reduce((acc, curr) => acc + curr.distance, 0)
  return {
    distance: miles(weekTotal).toFixed(2),
    count: weekActivities.length,
    time: weekActivities.reduce((acc, curr) => acc + curr.moving_time, 0),
  }
}

export const getStravaActivityUrl = (id: number) =>
  `https://www.strava.com/activities/${id}`

export function miles(meters: number): number {
  return meters * 0.000621371
}

export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secondsLeft = Math.floor(seconds % 60)
  return `${hours ? `${hours}:` : ''}${minutes
    .toString()
    .padStart(2, hours ? '0' : '')}:${secondsLeft.toString().padStart(2, '0')}`
}

export function getPace(meters: number, seconds: number) {
  const pace = seconds / miles(meters)
  return formatTime(pace)
}

export function getCurrentStreak(activities: SummaryActivity[]) {
  const sorted = activities.sort(
    (a, b) => +new Date(b.start_date_local) - +new Date(a.start_date_local),
  )

  const now = new Date()

  let streak = 0

  const yesterdayActivity = sorted.find((a) =>
    isSameDay(new Date(a.start_date_local), subDays(now, 1)),
  )

  if (!yesterdayActivity) {
    return 0
  }

  for (let i = 0; i < sorted.length; i++) {
    streak += 1

    const activity = sorted[i]
    const lastActivity = sorted[i + 1]

    // At the end
    if (!lastActivity) {
      break
    }

    const didActivityPreviousDay = isSameDay(
      subDays(new Date(activity.start_date_local), 1),
      new Date(lastActivity.start_date_local),
    )

    if (!didActivityPreviousDay) {
      break
    }
  }

  return streak
}
