"use server";

import { cookies } from "next/headers";
import { STRAVA_APP_ID, COOKIES } from "../lib/constants";
import { prisma } from "../lib/prisma";
import { getAthleteId } from "../lib/cookies";
import {
  AthleteStats as ActivityStats,
  DetailedAthlete,
  SummaryActivity,
} from "@/types/interfaces";
import { kv } from "@vercel/kv";

const BASE_URL = "https://www.strava.com/api/v3";

const CACHE_TTL = 60 * 60 * 12; // 12 hours in seconds

export async function stravaApiRequest(path: string) {
  const strava_athlete_id = Number(
    cookies().get(COOKIES.STRAVA_ATHLETE_ID)?.value
  );
  if (!strava_athlete_id) throw Error("Missing strava athlete id cookie");

  const user = await prisma.user.findFirst({ where: { strava_athlete_id } });
  if (!user) throw Error(`User not found with athlete id ${strava_athlete_id}`);

  const { strava_refresh_token, strava_expires_at } = user;
  let accessToken = user.strava_access_token;
  if (!accessToken || !strava_refresh_token || !strava_expires_at)
    throw Error("Missing strava access tokens");

  const accessTokenExpiresAt = strava_expires_at * 1000;
  const tokenExpired = accessTokenExpiresAt <= Date.now();

  if (tokenExpired) {
    accessToken = await refreshAccessToken(strava_refresh_token);
  }

  const cached = await kv.get(path);

  if (cached) return cached;

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json();

  if (res.status !== 200) throw Error(data.message);
  await kv.set(path, JSON.stringify(data), { ex: CACHE_TTL });

  return data;
}

async function refreshAccessToken(refreshToken: string) {
  const strava_secret = process.env.STRAVA_SECRET;

  if (!strava_secret) throw Error("Missing STRAVA_SECRET env variable");

  const params = {
    client_id: STRAVA_APP_ID.toString(),
    client_secret: strava_secret ?? "",
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };
  const paramsString = new URLSearchParams(params).toString();

  const res = await fetch(
    `https://www.strava.com/oauth/token?${paramsString}`,
    {
      method: "POST",
    }
  );

  const data: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  } = await res.json();
  const strava_athlete_id = Number(
    cookies().get(COOKIES.STRAVA_ATHLETE_ID)?.value
  );

  if (!strava_athlete_id) throw Error("Missing strava athlete id cookie");

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
  });

  return data.access_token;
}

export async function completeLogin(code: string) {
  "use server";

  const strava_secret = process.env.STRAVA_SECRET;

  if (!strava_secret) throw Error("Missing STRAVA_SECRET env variable");

  const params = {
    client_id: STRAVA_APP_ID.toString(),
    client_secret: strava_secret ?? "",
    code,
    grant_type: "authorization_code",
  };
  const paramsString = new URLSearchParams(params).toString();

  const res = await fetch(
    `https://www.strava.com/oauth/token?${paramsString}`,
    {
      method: "POST",
    }
  );

  const data = await res.json();

  await prisma.user.upsert({
    where: {
      strava_athlete_id: data.athlete.id,
      strava_access_token: data.access_token,
      strava_refresh_token: data.refresh_token,
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
  });

  cookies().set(COOKIES.STRAVA_ATHLETE_ID, data.athlete.id);
}

export async function getAthlete(): Promise<DetailedAthlete> {
  const data = await stravaApiRequest(`/athlete`);
  return data;
}

export async function getAthleteStats(): Promise<ActivityStats> {
  const athleteId = getAthleteId();
  if (!athleteId) throw Error("Missing athlete id");

  const data = await stravaApiRequest(`/athletes/${athleteId}/stats`);
  return data;
}

export async function getActivities(): Promise<SummaryActivity[]> {
  const athleteId = getAthleteId();
  if (!athleteId) return [];

  const data = await stravaApiRequest(`/athlete/activities`);
  return data;
}
