import { Card, CardContent } from './ui/card'
import {
  miles,
  formatTime,
  getPace,
  getStravaActivityUrl,
} from '@/lib/activities'
import { cn } from '@/lib/utils'
import { SummaryActivity } from '@/types/interfaces'
import { format } from 'date-fns'
import { ExternalLink } from './ui/external-link'

interface Props {
  activity: SummaryActivity
  compact?: boolean
  showStravaLink?: boolean
}

export function ActivitySummaryCard(props: Props) {
  const { activity, compact = false, showStravaLink = false } = props

  return (
    <Card>
      <CardContent className={cn({ 'p-6': !compact, 'p-3': compact })}>
        <div
          className={cn(
            'grid gap-2',
            showStravaLink
              ? 'md:grid-cols-[1fr_1fr_1fr_1fr_auto]'
              : 'md:grid-cols-4',
          )}
        >
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Distance
            </p>
            <p className="text-lg font-bold">
              {miles(activity.distance).toFixed(2)} mi
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Time</p>
            <p className="text-lg font-bold">
              {formatTime(activity.moving_time)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pace</p>
            <p className="text-lg font-bold">
              {getPace(activity.distance, activity.moving_time)} /mi
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date</p>
            <p className="text-lg font-bold">
              {format(activity.start_date, 'MMM d, yyyy h:mm aa')}
            </p>
          </div>
          {showStravaLink && (
            <div className="flex items-center">
              <ExternalLink href={getStravaActivityUrl(activity.id)}>
                View on Strava
              </ExternalLink>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
