"use client";
import { useEffect } from "react";
import { COOKIES } from "../lib/constants";

interface Props {
  stravaAccessToken: string | null;
  stravaRefreshToken: string | null;
  stravaExpiresAt: number | null;
}

export default function LoginSuccessListener(props: Props) {
  const { stravaAccessToken, stravaRefreshToken, stravaExpiresAt } = props;

  useEffect(() => {
    if (stravaAccessToken && stravaRefreshToken && stravaExpiresAt) {
      localStorage.setItem(COOKIES.STRAVA_ACCESS_TOKEN, stravaAccessToken);
      localStorage.setItem(COOKIES.STRAVA_REFRESH_TOKEN, stravaRefreshToken);
      localStorage.setItem(
        COOKIES.STRAVA_EXPIRES_AT,
        stravaExpiresAt.toString()
      );

      console.log("login handled");
    }
  }, [props]);

  return null;
}
