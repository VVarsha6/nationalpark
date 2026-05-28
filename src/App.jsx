import React, { useState } from 'react'
import TopNav from './components/TopNav'
import PeoplePanel from './components/PeoplePanel'
import ParkMap from './components/ParkMap'
import ParkList from './components/ParkList'
import ResultsPanel from './components/ResultsPanel'
import { useParks } from './hooks/useParks'
import { usePeople } from './hooks/usePeople'

export default function App() {
  const { parks, loading } = useParks()
  const { people, addPerson, updatePerson, removePerson, toggleVisited } = usePeople()
  const [activeTab, setActiveTab] = useState('Map')
  const [selectedPark, setSelectedPark] = useState(null)

  const mapHeight = 'calc(100vh - 60px)'

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {loading && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0,
          textAlign: 'center', padding: '8px', background: 'var(--surface)',
          color: 'var(--muted)', fontSize: 13, zIndex: 999,
        }}>
          Loading parks from NPS…
        </div>
      )}

      {activeTab === 'Map' && (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left sidebar */}
          <div style={{
            width: 300, flexShrink: 0, background: 'var(--surface)',
            borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 14px', overflowY: 'auto', flex: 1 }}>
              <PeoplePanel
                people={people} parks={parks}
                onAdd={addPerson} onUpdate={updatePerson} onRemove={removePerson}
              />
              <div style={{ margin: '16px 0', borderTop: '1px solid var(--border)' }} />
              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
                {[
                  { color: '#4caf6e', label: 'Visited by all' },
                  { color: '#f0a500', label: 'Visited by some' },
                  { color: '#e05c5c', label: 'Not visited' },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div style={{ flex: 1, position: 'relative' }}>
            <ParkMap parks={parks} people={people} onParkClick={setSelectedPark} />
          </div>

          {/* Right sidebar: park list */}
          <div style={{
            width: 280, flexShrink: 0, background: 'var(--surface)',
            borderLeft: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 14,
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: 'var(--accent2)' }}>
              🌲 All Parks
            </h2>
            <ParkList parks={parks} people={people} onToggleVisited={toggleVisited} />
          </div>
        </div>
      )}

      {activeTab === 'Plan' && (
        <div style={{
          display: 'flex', flex: 1, overflow: 'auto',
          padding: 24, gap: 24, justifyContent: 'center',
        }}>
          <div style={{ width: 320 }}>
            <PeoplePanel
              people={people} parks={parks}
              onAdd={addPerson} onUpdate={updatePerson} onRemove={removePerson}
            />
          </div>
          <div style={{ width: 440 }}>
            <ResultsPanel parks={parks} people={people} />
          </div>
        </div>
      )}
    </div>
  )
}