import { COOKIES } from '@/lib/constants'
import { cookies } from 'next/headers'
import { getActivities, getAthlete, getAthleteStats } from './actions'
import Navbar from '@/components/Navbar'
import { redirect } from 'next/navigation'
import { formatTime, miles } from '@/lib/numbers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Summary from '@/components/Summary'
import ActivityTable from '@/components/ActivityTable'
import WeeklySummary from '@/components/WeeklySummary'
import { getCurrentMonthName } from '@/lib/utils'
import { getCurrentWeekSummary, groupActivitiesByWeek } from '@/lib/activities'
import ActivityCalendar from '@/components/ActivityCalendar'
import React from 'react'
import { HistoricChart } from '@/components/HistoricChart'

export default async function Home() {
  const athleteId = cookies().get(COOKIES.STRAVA_ATHLETE_ID)?.value

  if (!athleteId) {
    redirect('/login')
  }

  const stats = await getAthleteStats()
  const athlete = await getAthlete()
  const allActivities = await getActivities()

  const activities = allActivities.filter((a) =>
    a.sport_type.toLowerCase().includes('run'),
  )

  const weeks = groupActivitiesByWeek(activities)
  const currentWeekSummary = getCurrentWeekSummary(activities)

  return (
    <div>
      <Navbar />

      <div className="mt-">
        <Tabs defaultValue="week">
          <TabsList className="mb-4">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="ytd">Year to Date</TabsTrigger>
            <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
          </TabsList>
          <TabsContent value="week">
            <h2 className="text-2xl">This Week</h2>
            <Summary
              runCount={currentWeekSummary.count}
              miles={currentWeekSummary.distance}
              time={formatTime(currentWeekSummary.time)}
            />
          </TabsContent>
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
        <div className="mt-12">
          <WeeklySummary groupedActivities={weeks} />
        </div>
        <h2 className="text-2xl mt-12 mb-2">Training Log</h2>
        <ActivityTable activities={activities} />
        <section className="flex sm:flex-row flex-col sm:justify-between">
          <div>
            <h2 className="text-2xl mt-12 mb-2">Calendar</h2>
            <ActivityCalendar activities={activities} />
          </div>
          <div>
            <h2 className="text-2xl mt-12 mb-2">Shoes</h2>
            <div className="inline-grid grid-cols-2 gap-x-20 gap-y-2">
              {athlete.shoes
                .sort((a, b) => b.distance - a.distance)
                .map((shoes) => (
                  <React.Fragment key={shoes.id}>
                    <div>{shoes.name}</div>
                    <div className="justify-self-end">
                      {miles(shoes.distance).toFixed(2)} mi
                    </div>
                  </React.Fragment>
                ))}
            </div>
          </div>
        </section>
      </div>
      <section className="w-full mt-12">
        <HistoricChart data={weeks} />
      </section>
    </div>
  )
}
