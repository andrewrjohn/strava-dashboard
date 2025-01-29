import { getCurrentWeekSummary } from '@/lib/activities'
import { getActivities, getAthleteStats } from '../actions'
import { WeekOverview } from './WeekOverview'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatTime, getPace, miles } from '@/lib/numbers'
import { format } from 'date-fns'

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
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Distance
                </p>
                <p className="text-lg font-bold">
                  {miles(latestActivity.distance).toFixed(2)} mi
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Time
                </p>
                <p className="text-lg font-bold">
                  {formatTime(latestActivity.moving_time)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pace
                </p>
                <p className="text-lg font-bold">
                  {getPace(latestActivity.distance, latestActivity.moving_time)}{' '}
                  /mi
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date
                </p>
                <p className="text-lg font-bold">
                  {format(latestActivity.start_date, 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
