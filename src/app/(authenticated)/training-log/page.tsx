import { getActivities } from '../../actions'
import ActivityTable from '@/components/ActivityTable'
import ActivityCalendar from '@/components/ActivityCalendar'

export default async function LogPage() {
  const allActivities = await getActivities()
  const activities = allActivities.filter((a) =>
    a.sport_type.toLowerCase().includes('run'),
  )

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Training Log</h2>
        <p className="text-muted-foreground">
          View and analyze your running history
        </p>
      </div>
      <ActivityCalendar activities={activities} />
      <ActivityTable activities={activities} />
    </div>
  )
}
