'use client'
import { SummaryActivity } from '@/types/interfaces'
import React from 'react'
import { Calendar } from './ui/calendar'
import { Button, buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { formatTime, getPace, miles } from '@/lib/numbers'
import { format } from 'date-fns'
import { ArrowRightIcon } from 'lucide-react'
import { ExternalLink } from './ui/external-link'
import { getStravaActivityUrl } from '@/lib/activities'

interface Props {
  activities: SummaryActivity[]
}

export default function ActivityCalendar(props: Props) {
  const { activities } = props

  return (
    <Calendar
      mode="multiple"
      components={{
        Day: (props) => {
          const activity = activities.find(
            (a) =>
              new Date(a.start_date).toDateString() ===
              props.date.toDateString(),
          )

          const outsideCurrentMonth =
            props.date.getMonth() !== props.displayMonth.getMonth()

          const isToday =
            props.date.toDateString() === new Date().toDateString()
          return activity ? (
            <Popover>
              <PopoverTrigger
                className={cn(buttonVariants(), 'h-9 w-9 p-0', {
                  'rounded-full': isToday,
                })}
              >
                {props.date.getDate()}
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid grid-cols-3">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Distance
                    </div>
                    <div className="font-bold">
                      {miles(activity.distance).toFixed()} mi
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Time</div>
                    <div className="font-bold">
                      {formatTime(activity.moving_time)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Pace</div>
                    <div className="font-bold">
                      {getPace(activity.distance, activity.moving_time)} /mi
                    </div>
                  </div>
                </div>
                <ExternalLink
                  className="mt-6"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getStravaActivityUrl(activity.id)}
                >
                  View on Strava <ArrowRightIcon className="h-5 w-5 ml-1" />
                </ExternalLink>
                <div className="text-sm text-muted-foreground mt-6">
                  {format(new Date(activity.start_date), 'E, MMMM do, yyyy')} at{' '}
                  {format(new Date(activity.start_date), 'h:mmaaa')}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div
              className={cn(
                buttonVariants({ variant: isToday ? 'outline' : 'ghost' }),
                'h-9 w-9 p-0 hover:bg-transparent',
                {
                  'text-muted-foreground opacity-50': outsideCurrentMonth,
                  'rounded-full': isToday,
                },
              )}
            >
              {props.date.getDate()}
            </div>
          )
        },
      }}
      onDayClick={(d, modifiers) => {
        if (modifiers.selected) {
          // show summary
          console.log(d)
        }
      }}
    />
  )
}
