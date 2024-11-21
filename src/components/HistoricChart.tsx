'use client'

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: Record<string, string>
}

export function HistoricChart(props: Props) {
  const data = Object.entries(props.data).map(([week, distance]) => ({
    week: week.split('-')[0],
    distance: Number(distance),
  }))
  data.reverse()

  const firstWeekWithData = data.findIndex((d) => d.distance > 0)
  data.splice(0, firstWeekWithData)

  return (
    <div className="h-[400px]">
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
            ticks={data
              .filter((_, i) =>
                i % 6 === 0 || i === 0 || i === data.length - 1 ? true : false,
              )
              .map(({ week }) => week)}
          />
          <Tooltip
            formatter={(value) => `${value} miles`}
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
                    {distance} mi
                  </div>
                </div>
              )
            }}
          />
          <Area
            type="natural"
            dataKey="distance"
            stroke="currentColor"
            fill="currentColor"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
