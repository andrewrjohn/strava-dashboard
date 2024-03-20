export const STRAVA_APP_ID = 122669;

export const STRAVA_AUTHORIZATION_URL = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_APP_ID}&response_type=code&redirect_uri=http://localhost:3000/login&approval_prompt=force&scope=activity:read_all,profile:read_all,read_all`;

export const COOKIES = {
  STRAVA_ATHLETE_ID: "strava_athlete_id",
};
