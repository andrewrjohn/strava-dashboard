'use client'

import { WeekSummary } from '@/types/interfaces'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: Record<string, WeekSummary>
}

export function HistoricChart(props: Props) {
  const data = Object.entries(props.data).map(([week, { distance }]) => ({
    week: week.split('-')[0],
    distance,
  }))
  data.reverse()

  const firstWeekWithData = data.findIndex((d) => d.distance > 0)
  data.splice(0, firstWeekWithData)

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis
            fontSize={14}
            className="mt-4"
            dataKey="week"
            ticks={data.map(({ week }, i) =>
              i % 6 === 0 || i === data.length - 1 ? week : '',
            )}
          />
          <Tooltip
            labelClassName="text-black"
            content={({ active, payload, label }) => {
              const firstPayload = payload?.[0]
              if (!firstPayload || !active) return null

              const week = firstPayload.payload.week
              const distance = firstPayload.value

              return (
                <div className="bg-card text-card-foreground p-2 rounded-md border-border border text-sm">
                  <div>{week}</div>
                  <div className="mt-1 text-muted-foreground">
                    {distance ? Number(distance).toFixed(2) : 0} mi
                  </div>
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="distance"
            stroke="#FC4C02"
            fill="#FC4C02"
            min={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
