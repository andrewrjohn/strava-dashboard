import { cookies } from "next/headers";
import { COOKIES } from "./constants";

export function getAthleteId() {
  return cookies().get(COOKIES.STRAVA_ATHLETE_ID)?.value ?? null;
}
