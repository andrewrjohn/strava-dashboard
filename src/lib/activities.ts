import { SummaryActivity } from '@/types/interfaces'
import { format, getISOWeeksInYear } from 'date-fns'
import { convertWeekNumberToDateRange, getCurrentWeekNumber } from '@/lib/utils'
import { miles } from './numbers'

export function groupActivitiesByWeek(activities: SummaryActivity[]) {
  const sorted = activities.sort(
    (a, b) => +new Date(b.start_date) - +new Date(a.start_date),
  )

  const weekLog: Record<string, number[]> = {}

  const firstActivityYear = new Date(
    sorted[sorted.length - 1].start_date,
  ).getFullYear()

  const currentYear = new Date().getFullYear()
  const currentWeek = Number(format(new Date(), 'w'))

  for (let year = currentYear; year >= firstActivityYear; year--) {
    const date = new Date()
    date.setFullYear(year)

    const totalWeeks =
      currentYear === year ? currentWeek : getISOWeeksInYear(date)

    for (let week = totalWeeks; week > 0; week--) {
      const range = convertWeekNumberToDateRange(year, week)

      weekLog[range] = []
    }
  }

  for (const activity of sorted) {
    const d = new Date(activity.start_date)

    const range = convertWeekNumberToDateRange(
      d.getFullYear(),
      Number(format(d, 'w')),
    )

    if (weekLog[range]) {
      weekLog[range].push(activity.distance)
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
  const week = convertWeekNumberToDateRange(
    new Date().getFullYear(),
    getCurrentWeekNumber(),
  )
  const weekActivities = activities.filter(
    (a) =>
      convertWeekNumberToDateRange(
        new Date().getFullYear(),
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
