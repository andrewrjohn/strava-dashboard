import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getAthlete } from '../../actions'
import { miles } from '@/lib/numbers'
import React from 'react'
import { FootprintsIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const MAX_DISTANCE = 300

export default async function GearPage() {
  const athlete = await getAthlete()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gear</h2>
        <p className="text-muted-foreground">Track your running equipment</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {athlete.shoes
          .sort((a, b) => b.distance - a.distance)
          .map((shoes) => (
            <Card key={shoes.id}>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium">
                    {shoes.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {miles(shoes.distance).toFixed(2)} mi / {MAX_DISTANCE} mi
                  </p>
                </div>
                <FootprintsIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Progress
                  value={(miles(shoes.distance) / MAX_DISTANCE) * 100}
                  className="h-2"
                />
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
