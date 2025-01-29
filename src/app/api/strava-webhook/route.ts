import { updateUserData } from '@/lib/strava'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { Env } from '@/lib/env'

type StravaWebhookBody = {
  object_type: 'activity' | 'athlete'
  // For activity events, the activity's ID. For athlete events, the athlete's ID.
  object_id: number
  // The time that the event occurred.
  event_time: number
  aspect_type: 'create' | 'update' | 'delete'
  // The athlete's ID.
  owner_id: number
  // The subscription's ID.
  subscription_id: number
  updates: Record<string, any>
}

export const POST = async (req: NextRequest) => {
  const body: StravaWebhookBody = await req.json()

  const athleteId = body.owner_id

  const user = await prisma.user.findFirst({
    where: { strava_athlete_id: athleteId },
  })

  if (user) {
    await updateUserData({ bypassCache: true })
  }

  return Response.json({ success: true }, { status: 200 })
}

export const GET = async (req: NextRequest) => {
  const query = req.nextUrl.searchParams
  const challenge = query.get('hub.challenge')
  const verifyToken = query.get('hub.verify_token')

  if (verifyToken !== Env.STRAVA_WEBHOOK_SECRET) {
    return Response.json({ success: false }, { status: 401 })
  }

  return Response.json({ 'hub.challenge': challenge }, { status: 200 })
}
