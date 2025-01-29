'use client'
import { getCurrentWeekRange } from '@/lib/utils'
import { WeekSummary } from '@/types/interfaces'
import { useState } from 'react'
import { Card } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'
import { formatTime } from '@/lib/activities'
interface Props {
  groupedActivities: Record<string, WeekSummary>
}

export default function WeeklySummary(props: Props) {
  const { groupedActivities } = props

  const [selectedWeek, setSelectedWeek] = useState<string>(
    getCurrentWeekRange(),
  )

  const selectedData = groupedActivities[selectedWeek]

  return (
    <div className="w-full md:max-w-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Week Total</h3>
        <Select onValueChange={(v) => setSelectedWeek(v)} value={selectedWeek}>
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
      <div className="flex items-center gap-2 mt-2 w-full flex-col">
        <Card className="w-full px-2 py-3">
          <h4 className="opacity-75 text-sm">Runs</h4>
          <p className="font-semibold text-4xl">{selectedData.count}</p>
        </Card>
        <Card className="w-full px-2 py-3">
          <h4 className="opacity-75 text-sm">Miles Ran</h4>
          <p className="font-semibold text-4xl">
            {selectedData.distance.toFixed(2)}
          </p>
        </Card>
        <Card className="w-full px-2 py-3">
          <h4 className="opacity-75 text-sm">Time Spent</h4>
          <p className="font-semibold text-4xl">
            {formatTime(selectedData.time)}
          </p>
        </Card>
      </div>
    </div>
  )
}
