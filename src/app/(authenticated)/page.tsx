import {
  getCurrentWeekSummary,
  formatTime,
  getPace,
  miles,
} from '@/lib/activities'
import { getActivities, getAthleteStats } from '../../lib/strava'
import { WeekOverview } from './WeekOverview'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { ActivitySummaryCard } from '@/components/ActivitySummaryCard'

export default async function Home() {
  const stats = await getAthleteStats()
  const allActivities = await getActivities()

  const activities = allActivities.filter((a) =>
    a.sport_type.toLowerCase().includes('run'),
  )
  const latestActivity = activities[0]

  const currentWeekSummary = getCurrentWeekSummary(activities)

  return (
    <div className="space-y-8 max-w-screen-lg">
      <WeekOverview currentWeekSummary={currentWeekSummary} stats={stats} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Latest Run</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/training-log">
              View all runs
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ActivitySummaryCard activity={latestActivity} />
      </div>
    </div>
  )
}
