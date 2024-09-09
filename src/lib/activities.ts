import { SummaryActivity } from '@/types/interfaces'
import { format } from 'date-fns'
import { convertWeekNumberToDateRange, getCurrentWeekNumber } from '@/lib/utils'
import { miles } from './numbers'

export function groupActivitiesByWeek(activities: SummaryActivity[]) {
  const sorted = activities.sort(
    (a, b) => +new Date(b.start_date) - +new Date(a.start_date),
  )

  const weekLog: Record<string, number[]> = {}

  for (let i = getCurrentWeekNumber(); i > 0; i--) {
    weekLog[convertWeekNumberToDateRange(i)] = []
  }

  for (const activity of sorted) {
    const week = convertWeekNumberToDateRange(
      Number(format(new Date(activity.start_date), 'w')),
    )

    if (weekLog[week]) {
      weekLog[week].push(activity.distance)
    }
  }

  const weekTotals: Record<string, string> = {}
  for (const [week, distances] of Object.entries(weekLog)) {
    weekTotals[week] = miles(
      distances.reduce((acc, curr) => acc + curr, 0),
    ).toFixed(2)
  }

  return weekTotals
}

export function getCurrentWeekSummary(activities: SummaryActivity[]) {
  const week = convertWeekNumberToDateRange(getCurrentWeekNumber())
  const weekActivities = activities.filter(
    (a) =>
      convertWeekNumberToDateRange(
        Number(format(new Date(a.start_date), 'w')),
      ) === week,
  )

  const weekTotal = weekActivities.reduce((acc, curr) => acc + curr.distance, 0)
  return {
    distance: miles(weekTotal).toFixed(2),
    count: weekActivities.length,
    time: weekActivities.reduce((acc, curr) => acc + curr.moving_time, 0),
    week,
  }
}

export const getStravaActivityUrl = (id: number) =>
  `https://www.strava.com/activities/${id}`
