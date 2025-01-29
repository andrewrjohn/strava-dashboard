import { HistoricChart } from '@/components/HistoricChart'
import { groupActivitiesByWeek } from '@/lib/activities'
import { getActivities } from '@/lib/strava'

export default async function Trends() {
  const allActivities = await getActivities()

  const activities = allActivities.filter((a) =>
    a.sport_type.toLowerCase().includes('run'),
  )
  const weeks = groupActivitiesByWeek(activities)

  return (
    <div className="space-y-8 flex flex-col flex-1">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Trends</h2>
        <p className="text-muted-foreground">
          Your running trends grouped by week
        </p>
      </div>
      <div className="flex-1 flex items-end">
        <HistoricChart data={weeks} />
      </div>
    </div>
  )
}
