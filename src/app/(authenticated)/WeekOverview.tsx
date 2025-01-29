'use client'

import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { getCurrentWeekSummary, formatTime, miles } from '@/lib/activities'
import { useState } from 'react'
import { getAthleteStats } from '@/lib/strava'

interface Props {
  currentWeekSummary: ReturnType<typeof getCurrentWeekSummary>
  stats: Awaited<ReturnType<typeof getAthleteStats>>
}

export function WeekOverview(props: Props) {
  const { currentWeekSummary, stats } = props
  const [timeline, setTimeline] = useState<
    'week' | 'month' | 'ytd' | 'lifetime'
  >('week')

  const Dropdown = () => (
    <Select
      defaultValue="week"
      value={timeline}
      onValueChange={(value) => setTimeline(value as any)}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select a range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="week">Week</SelectItem>
        <SelectItem value="month">Month</SelectItem>
        <SelectItem value="ytd">Year to Date</SelectItem>
        <SelectItem value="lifetime">Lifetime</SelectItem>
      </SelectContent>
    </Select>
  )

  return (
    <>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Your running overview</p>
      </div>

      <Tabs defaultValue="week" value={timeline}>
        <TabsContent value="week">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">This Week</h3>
            <Dropdown />
          </div>
          <DataCards
            runCount={currentWeekSummary.count}
            miles={currentWeekSummary.distance}
            time={formatTime(currentWeekSummary.time)}
          />
        </TabsContent>
        <TabsContent value="month">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">This Month</h3>
            <Dropdown />
          </div>
          <DataCards
            runCount={stats.recent_run_totals.count}
            miles={miles(stats.recent_run_totals.distance).toFixed(2)}
            time={formatTime(stats.recent_run_totals.moving_time)}
          />
        </TabsContent>
        <TabsContent value="ytd">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">This Year</h3>
            <Dropdown />
          </div>
          <DataCards
            runCount={stats.ytd_run_totals.count}
            miles={miles(stats.ytd_run_totals.distance).toFixed(2)}
            time={formatTime(stats.ytd_run_totals.moving_time)}
          />
        </TabsContent>
        <TabsContent value="lifetime">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Lifetime</h3>
            <Dropdown />
          </div>
          <DataCards
            runCount={stats.all_run_totals.count}
            miles={miles(stats.all_run_totals.distance).toFixed(2)}
            time={formatTime(stats.all_run_totals.moving_time)}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

interface DataCardsProps {
  runCount: number
  miles: string
  time: string
}

function DataCards(props: DataCardsProps) {
  const { runCount, miles, time } = props

  return (
    <div className="flex items-center gap-2 md:gap-10 mt-2 w-full flex-col md:flex-row">
      <Card className="w-full max-w-md px-2 py-3">
        <h4 className="opacity-75 text-sm">Runs</h4>
        <p className="font-semibold text-4xl">{runCount}</p>
      </Card>
      <Card className="w-full max-w-md px-2 py-3">
        <h4 className="opacity-75 text-sm">Miles Ran</h4>
        <p className="font-semibold text-4xl">{miles}</p>
      </Card>
      <Card className="w-full max-w-md px-2 py-3">
        <h4 className="opacity-75 text-sm">Time Spent</h4>
        <p className="font-semibold text-4xl">{time}</p>
      </Card>
    </div>
  )
}
