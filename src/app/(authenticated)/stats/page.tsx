import { HistoricChart } from '@/components/HistoricChart'
import WeeklySummary from '@/components/WeeklySummary'
import { groupActivitiesByWeek } from '@/lib/activities'
import { getActivities } from '../../actions'

export default async function Stats() {
  const allActivities = await getActivities()

  const activities = allActivities.filter((a) =>
    a.sport_type.toLowerCase().includes('run'),
  )
  const weeks = groupActivitiesByWeek(activities)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>
        <p className="text-muted-foreground">
          Your running analytics and trends
        </p>
      </div>
      {/* <div className="flex flex-col gap-2"> */}
      {/* <h3 className="text-lg font-medium">By Week</h3> */}
      <WeeklySummary groupedActivities={weeks} />
      {/* </div> */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Historic Trends</h3>
        <HistoricChart data={weeks} />
      </div>
    </div>
  )
}
