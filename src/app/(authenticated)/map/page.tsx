import { Map } from '@/components/map'
import { getActivities } from '@/lib/strava'

export default async function MapPage() {
  const allActivities = await getActivities()
  const activities = allActivities.filter((a) =>
    a.sport_type.toLowerCase().includes('run'),
  )

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Map</h2>
        <p className="text-muted-foreground">
          View every route you've ever run
        </p>
      </div>
      <Map activities={activities} />
    </div>
  )
}
