import { convertWeekNumberToDateRange, getCurrentWeekNumber } from '@/lib/utils'
import { SummaryActivity, WeekSummary } from '@/types/interfaces'
import { format } from 'date-fns'
import { miles } from './numbers'

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
