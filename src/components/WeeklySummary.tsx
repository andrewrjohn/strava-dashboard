'use client'
import React, { useState } from 'react'
import { getCurrentWeekRange } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'
import { Card, CardTitle, CardHeader, CardContent } from './ui/card'

interface Props {
  groupedActivities: Record<string, string>
}

export default function WeeklySummary(props: Props) {
  const { groupedActivities } = props

  const [selectedWeek, setSelectedWeek] = useState<string>(
    getCurrentWeekRange(),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
            <div>Week Total</div>
            <Select
              onValueChange={(v) => setSelectedWeek(v)}
              value={selectedWeek}
            >
              <SelectTrigger className="max-w-[240px]">
                {selectedWeek}
              </SelectTrigger>
              <SelectContent>
                {Object.keys(groupedActivities).map((week) => (
                  <SelectItem key={week} value={week}>
                    {week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-center md:justify-start gap-2">
          <p className="font-medium text-2xl">
            {groupedActivities[selectedWeek]}
          </p>
          <h4 className="text-muted-foreground mb-0.5 text-sm">miles</h4>
        </div>
      </CardContent>
    </Card>
  )
}
