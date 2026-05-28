import React, { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'

const VISITED_COLOR = '#4caf6e'
const UNVISITED_COLOR = '#e05c5c'
const PARTIAL_COLOR = '#f0a500'
const NEUTRAL_COLOR = '#7a9b82'

export default function ParkMap({ parks, people, onParkClick }) {
  const parkStatus = useMemo(() => {
    const map = {}
    for (const park of parks) {
      if (people.length === 0) {
        map[park.code] = 'neutral'
        continue
      }
      const visitedBy = people.filter(p => p.visitedParks?.includes(park.code)).length
      if (visitedBy === 0) map[park.code] = 'unvisited'
      else if (visitedBy === people.length) map[park.code] = 'visited'
      else map[park.code] = 'partial'
    }
    return map
  }, [parks, people])

  const colorFor = (code) => ({
    visited: VISITED_COLOR,
    unvisited: UNVISITED_COLOR,
    partial: PARTIAL_COLOR,
    neutral: NEUTRAL_COLOR,
  }[parkStatus[code]] || NEUTRAL_COLOR)

  return (
    <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', height: '100%' }}>
      <MapContainer
        center={[39.5, -98.35]} zoom={4}
        style={{ height: '100%', width: '100%', background: '#0f1a12' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {parks.map(park => (
          <CircleMarker
            key={park.code}
            center={[park.lat, park.lng]}
            radius={7}
            pathOptions={{
              fillColor: colorFor(park.code),
              color: colorFor(park.code),
              fillOpacity: 0.85,
              weight: 1.5,
            }}
            eventHandlers={{ click: () => onParkClick?.(park) }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              <span style={{ fontWeight: 600 }}>{park.name}</span><br />
              <span style={{ fontSize: 11, color: '#aaa' }}>{park.state}</span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}