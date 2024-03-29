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

    weekLog[week].push(activity.distance)
  }

  const weekTotals: Record<string, string> = {}
  for (const [week, distances] of Object.entries(weekLog)) {
    weekTotals[week] = miles(
      distances.reduce((acc, curr) => acc + curr, 0),
    ).toFixed(2)
  }

  return weekTotals
}
