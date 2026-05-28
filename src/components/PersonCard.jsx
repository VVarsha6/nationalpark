import React from 'react'

export default function PersonCard({ person, index, onEdit, onRemove, parks }) {
  const visitedCount = person.visitedParks?.length || 0
  const totalParks = parks.length

  return (
    <div style={{
      background: 'var(--surface2)', borderRadius: 'var(--radius)',
      padding: '14px 16px', border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff',
          }}>
            P{index + 1}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{person.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              {person.airports?.join(', ') || 'No airport set'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => onEdit(person)} style={{
            padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--muted)', fontSize: 12,
          }}>Edit</button>
          <button onClick={() => onRemove(person.id)} style={{
            padding: '4px 10px', borderRadius: 6, border: 'none',
            background: 'var(--danger)', color: '#fff', fontSize: 12,
          }}>✕</button>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden',
        }}>
          <div style={{
            width: `${totalParks ? (visitedCount / totalParks) * 100 : 0}%`,
            height: '100%', background: 'var(--accent)', borderRadius: 3, transition: 'width 0.4s',
          }} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
          {visitedCount}/{totalParks} visited
        </span>
      </div>
      {person.budget && (
        <div style={{ fontSize: 12, color: 'var(--accent2)' }}>
          💰 Budget: ${parseFloat(person.budget).toLocaleString()}
        </div>
      )}
    </div>
  )
}