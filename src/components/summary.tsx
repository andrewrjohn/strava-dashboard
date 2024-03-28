import React from 'react'
import { Card } from './ui/card'

interface Props {
  runCount: number
  miles: string
  time: string
}

export default function Summary(props: Props) {
  const { runCount, miles, time } = props

  return (
    <div className="flex items-center gap-10 mt-2 w-full">
      <Card className="w-full max-w-md px-2 py-3">
        <h4 className="opacity-75 text-sm">
          Runs
        </h4>
        <p className="font-semibold text-4xl">
          {runCount}
        </p>
      </Card>
      <Card className="w-full max-w-md px-2 py-3">
        <h4 className="opacity-75 text-sm">
          Miles Ran
        </h4>
        <p className="font-semibold text-4xl">
          {miles}
        </p>
      </Card>
      <Card className="w-full max-w-md px-2 py-3">
        <h4 className="opacity-75 text-sm">
          Time Spent
        </h4>
        <p className="font-semibold text-4xl">
          {time}
        </p>
      </Card>
    </div>
  )
}
