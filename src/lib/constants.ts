export const STRAVA_APP_ID = 122669

const redirectBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://run.weaklytyped.com'
    : 'http://localhost:3000'

export const STRAVA_AUTHORIZATION_URL = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_APP_ID}&response_type=code&redirect_uri=${redirectBaseUrl}/login&approval_prompt=force&scope=activity:read_all,profile:read_all,read_all`

export const COOKIES = {
  STRAVA_ATHLETE_ID: 'strava_athlete_id',
}

export const STRAVA_ORANGE = '#FC4C02'
