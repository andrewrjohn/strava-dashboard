export interface SummaryActivity {
  resource_state: number
  athlete: {
    id: number
    resource_state: number
  }
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  type: string
  sport_type: string
  workout_type: null
  id: number
  start_date: string
  start_date_local: string
  timezone: string
  utc_offset: number
  location_city: null
  location_state: null
  location_country: string
  achievement_count: number
  kudos_count: number
  comment_count: number
  athlete_count: number
  photo_count: number
  map: {
    id: string
    summary_polyline: string
    resource_state: number
  }
  trainer: boolean
  commute: boolean
  manual: boolean
  private: boolean
  visibility: string
  flagged: boolean
  gear_id: null
  start_latlng: [number, number]
  end_latlng: [number, number]
  average_speed: number
  max_speed: number
  has_heartrate: boolean
  heartrate_opt_out: boolean
  display_hide_heartrate_option: boolean
  elev_high: number
  elev_low: number
  upload_id: number
  upload_id_str: string
  external_id: string
  from_accepted_tag: boolean
  pr_count: number
  total_photo_count: number
  has_kudoed: boolean
}

export interface DetailedAthlete {
  id: number
  resource_state: number
  firstname: string
  lastname: string
  profile_medium: string
  profile: string
  city: string
  state: string
  country: string
  sex: string
  premium: boolean
  summit: boolean
  created_at: string
  updated_at: string
  follower_count: number
  friend_count: number
  measurement_preference: string
  ftp: number
  weight: number
  clubs: SummaryClub[]
  bikes: SummaryGear[]
  shoes: SummaryGear[]
}

export interface SummaryClub {
  id: number
  resource_state: number
  name: string
  profile_medium: string
  cover_photo: string
  cover_photo_small: string
  sport_type: string
  activity_types: ActivityType[]
  city: string
  state: string
  country: string
  private: boolean
  member_count: number
  featured: boolean
  verified: boolean
  url: string
}

export interface ActivityType {
  id: number
  name: string
}

export interface SummaryGear {
  id: string
  resource_state: number
  primary: boolean
  name: string
  distance: number
}

export interface AthleteStats {
  biggest_ride_distance: number
  biggest_climb_elevation_gain: number
  recent_ride_totals: ActivityTotal
  recent_run_totals: ActivityTotal
  recent_swim_totals: ActivityTotal
  ytd_ride_totals: ActivityTotal
  ytd_run_totals: ActivityTotal
  ytd_swim_totals: ActivityTotal
  all_ride_totals: ActivityTotal
  all_run_totals: ActivityTotal
  all_swim_totals: ActivityTotal
}

export interface ActivityTotal {
  distance: number
  moving_time: number
  elapsed_time: number
  elevation_gain: number
  achievement_count: number
  count: number
}
