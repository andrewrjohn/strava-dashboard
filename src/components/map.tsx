'use client'

import React, { useEffect, useState } from 'react'
const MapContainer = dynamic(
  () => import('react-leaflet').then(({ MapContainer }) => MapContainer),
  { ssr: false },
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(({ TileLayer }) => TileLayer),
  { ssr: false },
)
const Polyline = dynamic(
  () => import('react-leaflet').then(({ Polyline }) => Polyline),
  { ssr: false },
)
const Tooltip = dynamic(
  () => import('react-leaflet').then(({ Tooltip }) => Tooltip),
  { ssr: false },
)

import { SummaryActivity } from '@/types/interfaces'
import polyline from '@mapbox/polyline'

import 'leaflet/dist/leaflet.css'
import { getStravaActivityUrl } from '@/lib/activities'
import dynamic from 'next/dynamic'
import { useMap, useMapEvent } from 'react-leaflet'
import { STRAVA_ORANGE } from '@/lib/colors'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'
import { format } from 'date-fns'
import { LatLngExpression } from 'leaflet'
import { ActivitySummaryCard } from './ActivitySummaryCard'

const DEFAULT_STROKE_WEIGHT = 4
const DEFAULT_STROKE_OPACITY = 0.5

interface Props {
  activities: SummaryActivity[]
}

export function Map(props: Props) {
  const [selectedActivityId, setSelectedActivityId] = useState('all')

  const selectedActivity =
    props.activities.find((a) => a.id === Number(selectedActivityId)) || 'All'

  const activities =
    selectedActivityId !== 'all'
      ? props.activities.filter((a) => a.id === Number(selectedActivityId))
      : props.activities

  const latestActivityPos = polyline.decode(
    props.activities[0].map.summary_polyline,
  )
  const positions =
    typeof selectedActivity === 'string'
      ? latestActivityPos
      : polyline.decode(selectedActivity.map.summary_polyline)

  const centerPosition = {
    lat: positions[0][0],
    lng: positions[0][1],
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Map</h2>
          <p className="text-muted-foreground">
            View every route you've ever run
          </p>
        </div>
        <Select
          onValueChange={(v) => setSelectedActivityId(v)}
          value={selectedActivityId}
        >
          <SelectTrigger className="max-w-[240px]">
            {typeof selectedActivity === 'string'
              ? 'All Activities'
              : format(new Date(selectedActivity.start_date), 'MMM d, yyyy')}
          </SelectTrigger>
          <SelectContent className="z-[999]">
            <SelectItem value="all">All Activities</SelectItem>
            {props.activities.map((activity) => (
              <SelectItem key={activity.id} value={activity.id.toString()}>
                {format(new Date(activity.start_date), 'MMM d, yyyy h:mm a')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {typeof selectedActivity !== 'string' && (
        <ActivitySummaryCard
          activity={selectedActivity}
          compact
          showStravaLink={true}
        />
      )}

      <div className="w-full h-[85vh]">
        <MapContainer
          center={centerPosition}
          zoom={13}
          scrollWheelZoom
          className="h-full w-full"
        >
          <PositionListener centerPosition={centerPosition} />
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            // url="http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          />
          <Polylines activities={activities} />
        </MapContainer>
      </div>
    </div>
  )
}

function PositionListener({
  centerPosition,
}: {
  centerPosition: LatLngExpression
}) {
  const map = useMap()

  useEffect(() => {
    map.setView(centerPosition)
  }, [centerPosition])

  return null
}

function Polylines(props: Props) {
  const { activities } = props
  const [strokeWeight, setStrokeWeight] = useState(DEFAULT_STROKE_WEIGHT)
  const [strokeOpacity, setStrokeOpacity] = useState(DEFAULT_STROKE_OPACITY)

  useMapEvent('zoom', (e) => {
    const zoom: number = e.target._zoom

    if (zoom < 10) {
      // Zoomed really far out
      setStrokeWeight(7)
      setStrokeOpacity(1)

      return
    } else {
      setStrokeWeight(DEFAULT_STROKE_WEIGHT)
      setStrokeOpacity(DEFAULT_STROKE_OPACITY)
    }
  })

  return (
    <>
      {activities.map((activity) => (
        <ActivityPolyline
          key={activity.id}
          activity={activity}
          strokeWeight={strokeWeight}
          strokeOpacity={strokeOpacity}
        />
      ))}
    </>
  )
}

function ActivityPolyline({
  activity,
  strokeWeight,
  strokeOpacity,
}: {
  activity: SummaryActivity
  strokeWeight: number
  strokeOpacity: number
}) {
  const positions = polyline.decode(activity.map.summary_polyline)

  return (
    <Polyline
      pathOptions={{
        color: STRAVA_ORANGE,
        weight: strokeWeight,
        opacity: strokeOpacity,
      }}
      eventHandlers={{
        click: () => {
          window.open(getStravaActivityUrl(activity.id), '_blank')
        },
      }}
      positions={positions}
    >
      <Tooltip content={activity.name} sticky />
    </Polyline>
  )
}
