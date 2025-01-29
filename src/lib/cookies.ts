import { cookies } from 'next/headers'

const KEYS = {
  STRAVA_ATHLETE_ID: 'strava_athlete_id',
}

export function getCurrentAthleteId() {
  return cookies().get(KEYS.STRAVA_ATHLETE_ID)?.value ?? null
}

export function setCurrentAthleteId(athleteId: number) {
  cookies().set(KEYS.STRAVA_ATHLETE_ID, athleteId.toString())
}

export function clearCurrentAthleteId() {
  cookies().delete(KEYS.STRAVA_ATHLETE_ID)
}
