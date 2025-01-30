import { z } from 'zod'

if (typeof window !== 'undefined') {
  throw Error(
    "Env should only be used on the server (make sure you're not trying to use it in a client component)",
  )
}

const EnvSchema = z.object({
  STRAVA_APP_ID: z.string(),
  STRAVA_SECRET: z.string(),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  STRAVA_WEBHOOK_SECRET: z.string(),
  JWT_SECRET: z.string(),
})

export const Env = EnvSchema.parse({
  STRAVA_APP_ID: process.env.STRAVA_APP_ID,
  STRAVA_SECRET: process.env.STRAVA_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  STRAVA_WEBHOOK_SECRET: process.env.STRAVA_WEBHOOK_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
})
