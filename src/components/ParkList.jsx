import React, { useState } from 'react'

export default function ParkList({ parks, people, onToggleVisited }) {
  const [search, setSearch] = useState('')

  const filtered = parks.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.state.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      <input
        placeholder="Search parks..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          padding: '9px 14px', borderRadius: 8, border: '1px solid var(--border)',
          background: 'var(--surface2)', color: 'var(--text)', fontSize: 14,
          marginBottom: 10, outline: 'none',
        }}
      />
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {filtered.map(park => {
          const visitors = people.filter(p => p.visitedParks?.includes(park.code))
          return (
            <div key={park.code} style={{
              padding: '10px 12px', borderBottom: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{park.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{park.state}</div>
                </div>
              </div>
              {people.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {people.map((p, i) => {
                    const visited = p.visitedParks?.includes(park.code)
                    return (
                      <button
                        key={p.id}
                        onClick={() => onToggleVisited(p.id, park.code)}
                        title={visited ? `${p.name} visited — click to unmark` : `Mark ${p.name} as visited`}
                        style={{
                          padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          border: visited ? 'none' : '1px solid var(--border)',
                          background: visited ? 'var(--accent)' : 'transparent',
                          color: visited ? '#fff' : 'var(--muted)',
                          transition: 'all 0.15s', cursor: 'pointer',
                        }}
                      >
                        P{i + 1}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}