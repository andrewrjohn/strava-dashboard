import { getActivities } from '../../../lib/strava'
import ActivityTable from '@/components/ActivityTable'
import ActivityCalendar from '@/components/ActivityCalendar'
import WeeklySummary from '@/components/WeeklySummary'
import { groupActivitiesByWeek } from '@/lib/activities'

export default async function LogPage() {
  const allActivities = await getActivities()
  const activities = allActivities.filter((a) =>
    a.sport_type.toLowerCase().includes('run'),
  )
  const weeks = groupActivitiesByWeek(activities)
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Training Log</h2>
        <p className="text-muted-foreground">
          View and analyze your running history
        </p>
      </div>
      <div className="flex items-center gap-8 flex-col md:flex-row">
        <WeeklySummary groupedActivities={weeks} />
        <ActivityCalendar activities={activities} />
      </div>
      <ActivityTable activities={activities} />
    </div>
  )
}
