'use client'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { getCurrentWeekRange } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'

interface Props {
  groupedActivities: Record<string, string>
}

export default function WeeklySummary(props: Props) {
  const { groupedActivities } = props

  const [selectedWeek, setSelectedWeek] = useState<string>(
    getCurrentWeekRange(),
  )

  return (
    <>
      <div className="flex gap-2 md:items-start mb-2 flex-col">
        <h2 className="text-2xl">Week</h2>

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
      <div className="flex items-end gap-2 mt-4 md:mt-0">
        <p className="font-semibold text-4xl">
          {groupedActivities[selectedWeek]}
        </p>
        <h4 className="opacity-75 text-sm">miles</h4>
      </div>
    </>
  )
}
