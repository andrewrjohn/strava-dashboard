'use client'

import React, { useState } from 'react'
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
import { STRAVA_ORANGE } from '@/lib/constants'
import { getStravaActivityUrl } from '@/lib/activities'
import dynamic from 'next/dynamic'
import { useMapEvent } from 'react-leaflet'

const DEFAULT_STROKE_WEIGHT = 4
const DEFAULT_STROKE_OPACITY = 0.5

interface Props {
  activities: SummaryActivity[]
}

export function Map(props: Props) {
  const { activities } = props

  const positions = polyline.decode(activities[0].map.summary_polyline)

  const startPosition = {
    lat: positions[0][0],
    lng: positions[0][1],
  }

  return (
    <div className="w-full h-[85vh]">
      <MapContainer
        center={startPosition}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          // url="http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
        <Polylines activities={activities} />
      </MapContainer>
    </div>
  )
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
