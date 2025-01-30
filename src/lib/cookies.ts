import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { Env } from './env'

const KEYS = {
  AUTH_TOKEN: 'run_hub_auth_token',
}

export function getCurrentAthleteId() {
  const value = cookies().get(KEYS.AUTH_TOKEN)?.value ?? null
  if (!value) return null

  try {
    const payload = jwt.verify(value, Env.JWT_SECRET) as string
    const athleteId = Number(payload)

    if (!athleteId) return null

    return athleteId
  } catch {
    return null
  }
}

export function setCurrentAthleteId(athleteId: number) {
  const token = jwt.sign(athleteId.toString(), Env.JWT_SECRET)

  cookies().set(KEYS.AUTH_TOKEN, token)
}

export function clearCurrentAthleteId() {
  cookies().delete(KEYS.AUTH_TOKEN)
}
