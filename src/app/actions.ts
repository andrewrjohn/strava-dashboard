'use server'

import { cookies } from 'next/headers'
import { STRAVA_APP_ID, COOKIES } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { getAthleteId } from '@/lib/cookies'
import {
  AthleteStats as ActivityStats,
  DetailedActivity,
  DetailedAthlete,
  SummaryActivity,
} from '@/types/interfaces'
import { redirect } from 'next/navigation'
import { redis } from '@/lib/redis'

const BASE_URL = 'https://www.strava.com/api/v3'

// Strava rate limits are pretty low
// The user cache is updated via webhook, so this is more like a max TTL in case of webhook failure
const CACHE_TTL = 60 * 60 * 24 // 24 hours in seconds

export async function stravaApiRequest(path: string, stravaAthleteId?: number) {
  const strava_athlete_id =
    stravaAthleteId ?? Number(cookies().get(COOKIES.STRAVA_ATHLETE_ID)?.value)
  if (!strava_athlete_id) throw Error('Missing strava athlete id cookie')

  const user = await prisma.user.findFirst({ where: { strava_athlete_id } })
  if (!user) throw Error(`User not found with athlete id ${strava_athlete_id}`)

  const { strava_refresh_token, strava_expires_at } = user
  let accessToken = user.strava_access_token
  if (!accessToken || !strava_refresh_token || !strava_expires_at)
    throw Error('Missing strava access tokens')

  const accessTokenExpiresAt = strava_expires_at * 1000
  const tokenExpired = accessTokenExpiresAt <= Date.now()

  if (tokenExpired) {
    accessToken = await refreshAccessToken(
      strava_refresh_token,
      stravaAthleteId,
    )
  }

  const initialUrl = new URL(`${BASE_URL}${path}`)

  const cacheKey = strava_athlete_id.toString() + initialUrl.pathname

  // We pass in the athlete ID when updating from webhook
  // so we want to bypass the cache in this case
  if (!stravaAthleteId) {
    const cached = await redis.get(cacheKey)

    if (cached) return JSON.parse(cached)
  }

  let data: any

  const fetchData = async (url: URL) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    const innerData = await res.json()

    if (res.status !== 200) throw Error(innerData.message)

    const pageSize = Number(url.searchParams.get('per_page'))
    const isPaginated = pageSize > 0

    if (!isPaginated) {
      data = innerData
      return
    }

    if (data) {
      data = [...data, ...innerData]
    } else {
      data = innerData
    }

    const hasNextPage =
      Array.isArray(innerData) && innerData.length === pageSize

    if (hasNextPage) {
      const currentPage = Number(url.searchParams.get('page')) || 1

      const nextUrl = new URL(url)
      nextUrl.searchParams.set('page', `${currentPage + 1}`)

      await fetchData(nextUrl)
    }
  }

  await fetchData(initialUrl)

  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data))

  return data
}

async function refreshAccessToken(
  refreshToken: string,
  stravaAthleteId?: number,
) {
  const strava_secret = process.env.STRAVA_SECRET

  if (!strava_secret) throw Error('Missing STRAVA_SECRET env variable')

  const params = {
    client_id: STRAVA_APP_ID.toString(),
    client_secret: strava_secret ?? '',
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  }
  const paramsString = new URLSearchParams(params).toString()

  const res = await fetch(
    `https://www.strava.com/oauth/token?${paramsString}`,
    {
      method: 'POST',
    },
  )

  const data: {
    access_token: string
    refresh_token: string
    expires_at: number
  } = await res.json()
  const strava_athlete_id =
    stravaAthleteId ?? Number(cookies().get(COOKIES.STRAVA_ATHLETE_ID)?.value)

  if (!strava_athlete_id) throw Error('Missing strava athlete id cookie')

  // upsert user with new access token, refresh token, and expires_at, based on athlete id
  await prisma.user.upsert({
    where: {
      strava_athlete_id,
    },
    update: {
      strava_expires_at: data.expires_at,
      strava_access_token: data.access_token,
      strava_refresh_token: data.refresh_token,
    },
    create: {
      strava_athlete_id,
      strava_expires_at: data.expires_at,
      strava_access_token: data.access_token,
      strava_refresh_token: data.refresh_token,
    },
  })

  return data.access_token
}

export async function completeLogin(code: string) {
  'use server'

  const strava_secret = process.env.STRAVA_SECRET

  if (!strava_secret) throw Error('Missing STRAVA_SECRET env variable')

  const params = {
    client_id: STRAVA_APP_ID.toString(),
    client_secret: strava_secret ?? '',
    code,
    grant_type: 'authorization_code',
  }
  const paramsString = new URLSearchParams(params).toString()

  const res = await fetch(
    `https://www.strava.com/oauth/token?${paramsString}`,
    {
      method: 'POST',
    },
  )

  const data = await res.json()

  await prisma.user.upsert({
    where: {
      strava_athlete_id: data.athlete.id,
    },
    update: {
      strava_expires_at: data.expires_at,
      strava_access_token: data.access_token,
      strava_refresh_token: data.refresh_token,
      strava_athlete_id: data.athlete.id,
    },
    create: {
      strava_athlete_id: data.athlete.id,
      strava_expires_at: data.expires_at,
      strava_access_token: data.access_token,
      strava_refresh_token: data.refresh_token,
    },
  })

  cookies().set(COOKIES.STRAVA_ATHLETE_ID, data.athlete.id)
}

export async function logout() {
  cookies().delete(COOKIES.STRAVA_ATHLETE_ID)

  redirect('/login')
}

export async function getAthlete(
  stravaAthleteId?: number,
): Promise<DetailedAthlete> {
  const data = await stravaApiRequest(`/athlete`, stravaAthleteId)
  return data
}

export async function getAthleteStats(
  stravaAthleteId?: number,
): Promise<ActivityStats> {
  let athleteId = stravaAthleteId ?? getAthleteId()
  if (!athleteId) throw Error('Missing athlete id')
  athleteId = Number(athleteId)

  const data = (await stravaApiRequest(
    `/athletes/${athleteId}/stats`,
    athleteId,
  )) as ActivityStats

  const activities = await getActivities(athleteId)

  // YTD stats - for some reason Strava is returning empty values for this
  // so we need to calculate it manually
  if (activities.length && !data.ytd_run_totals.count) {
    const ytdActivities = activities.filter(
      (a) => new Date(a.start_date).getFullYear() === new Date().getFullYear(),
    )
    const ytdDistance = ytdActivities.reduce((acc, a) => acc + a.distance, 0)
    const ytdTime = ytdActivities.reduce((acc, a) => acc + a.moving_time, 0)

    data.ytd_run_totals.count = ytdActivities.length
    data.ytd_run_totals.distance = ytdDistance
    data.ytd_run_totals.moving_time = ytdTime
  }

  // Lifetime stats - for some reason Strava is returning empty values for this
  // so we need to calculate it manually
  if (activities.length && !data.all_run_totals.count) {
    const lifetimeDistance = activities.reduce((acc, a) => acc + a.distance, 0)
    const lifetimeTime = activities.reduce((acc, a) => acc + a.moving_time, 0)

    data.all_run_totals.count = activities.length
    data.all_run_totals.distance = lifetimeDistance
    data.all_run_totals.moving_time = lifetimeTime
  }

  return data
}

export async function getActivities(
  stravaAthleteId?: number,
): Promise<SummaryActivity[]> {
  let athleteId = stravaAthleteId ?? getAthleteId()
  if (!athleteId) throw Error('Missing athlete id')
  athleteId = Number(athleteId)

  if (!athleteId) return []

  // Strava max is 200
  const pageSize = 200

  const data = await stravaApiRequest(
    `/athlete/activities?per_page=${pageSize}`,
    athleteId,
  )
  return data
}

export async function updateUserData(athleteId: number) {
  await getAthlete(athleteId)
  await getAthleteStats(athleteId)
  await getActivities(athleteId)
}

export async function getDetailedActivity(
  activityId: number,
): Promise<DetailedActivity> {
  const athleteId = getAthleteId()
  if (!athleteId) throw Error('Missing athlete id')

  const data = await stravaApiRequest(
    `/activities/${activityId}`,
    Number(athleteId),
  )
  return data
}
