import { COOKIES } from './lib/constants'
import { cookies } from 'next/headers'
import { getActivities, getAthleteStats } from './actions'
import Navbar from './components/Navbar'
import { redirect } from 'next/navigation'
import { formatTime, miles } from './lib/numbers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Summary from '@/components/summary'
import ActivityTable from '@/components/activity-table'
import { SummaryActivity } from '@/types/interfaces'
import { format } from 'date-fns'
import WeeklySummary from '@/components/weekly-summary'
import {
  convertWeekNumberToDateRange,
  getCurrentMonthName,
  getCurrentWeekNumber,
} from './lib/utils'

function groupActivitiesByWeek(activities: SummaryActivity[]) {
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

export default async function Home() {
  const athleteId = cookies().get(COOKIES.STRAVA_ATHLETE_ID)?.value

  if (!athleteId) {
    redirect('/login')
  }

  const stats = await getAthleteStats()

  const activities = (await getActivities()).filter((a) =>
    a.sport_type.toLowerCase().includes('run'),
  )

  const weeks = groupActivitiesByWeek(activities)

  return (
    <main className="pb-20">
      <Navbar />

      <div className="mt-">
        <Tabs defaultValue="month">
          <TabsList className="mb-4">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="ytd">Year to Date</TabsTrigger>
            <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
          </TabsList>
          <TabsContent value="month">
            <h2 className="text-2xl">{getCurrentMonthName()}</h2>
            <Summary
              runCount={stats.recent_run_totals.count}
              miles={miles(stats.recent_run_totals.distance).toFixed(2)}
              time={formatTime(stats.recent_run_totals.moving_time)}
            />
          </TabsContent>
          <TabsContent value="ytd">
            <h2 className="text-2xl">{new Date().getFullYear()}</h2>
            <Summary
              runCount={stats.ytd_run_totals.count}
              miles={miles(stats.ytd_run_totals.distance).toFixed(2)}
              time={formatTime(stats.ytd_run_totals.moving_time)}
            />
          </TabsContent>
          <TabsContent value="lifetime">
            <h2 className="text-2xl">Lifetime</h2>
            <Summary
              runCount={stats.all_run_totals.count}
              miles={miles(stats.all_run_totals.distance).toFixed(2)}
              time={formatTime(stats.all_run_totals.moving_time)}
            />
          </TabsContent>
        </Tabs>
        <div className="mt-8">
          <WeeklySummary groupedActivities={weeks} />
        </div>
        <h2 className="text-2xl mt-8 mb-2">Runs</h2>
        <ActivityTable activities={activities} />
      </div>
    </main>
  )
}
