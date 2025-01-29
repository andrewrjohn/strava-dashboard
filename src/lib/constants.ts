import { Env } from './env'

const redirectBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://run.weaklytyped.com'
    : 'http://localhost:3000'

export const STRAVA_AUTHORIZATION_URL = `https://www.strava.com/oauth/authorize?client_id=${Env.STRAVA_APP_ID}&response_type=code&redirect_uri=${redirectBaseUrl}/login&approval_prompt=force&scope=activity:read_all,profile:read_all,read_all`
