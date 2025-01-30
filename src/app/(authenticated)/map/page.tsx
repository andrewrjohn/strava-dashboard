import { Map } from '@/components/map'
import { getActivities } from '@/lib/strava'

export default async function MapPage() {
  const allActivities = await getActivities()
  const activities = allActivities.filter((a) =>
    a.sport_type.toLowerCase().includes('run'),
  )

  return <Map activities={activities} />
}
