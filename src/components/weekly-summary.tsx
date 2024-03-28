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
import { getCurrentWeekRange } from '@/app/lib/utils'

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
      <div className="flex items-center gap-2 mt-8 mb-2">
        <h2 className="text-2xl">Weekly Summary</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'outline'} className="flex items-center gap-2">
              {selectedWeek}
              <ChevronDown className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.keys(groupedActivities).map((week) => (
              <DropdownMenuCheckboxItem
                key={week}
                onClick={() => setSelectedWeek(week)}
                checked={selectedWeek === week}
              >
                {week}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-end gap-2">
        <p className="font-semibold text-4xl">
          {groupedActivities[selectedWeek]}
        </p>
        <h4 className="opacity-75 text-sm">miles</h4>
      </div>
    </>
  )
}
