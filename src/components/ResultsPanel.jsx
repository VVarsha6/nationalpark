import React, { useState } from 'react'
import { scoreParks } from '../services/scorer'

export default function ResultsPanel({ parks, people }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const handleRun = async () => {
    if (people.length === 0) { setError('Add at least one person first.'); return }
    const missingAirports = people.filter(p => !p.airports?.length)
    if (missingAirports.length > 0) {
      setError(`Missing airports for: ${missingAirports.map(p => p.name).join(', ')}`)
      return
    }
    setLoading(true); setError(null); setProgress(0); setResults([])
    try {
      const top5 = await scoreParks({
        parks, people,
        onProgress: setProgress,
      })
      setResults(top5)
      if (top5.length === 0) setError('No feasible parks found within budgets. Try increasing budgets or removing visited parks.')
    } catch (e) {
      setError('Error fetching flights. Check your Amadeus API keys.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent2)' }}>🏆 Top 5 Picks</h2>
        <button onClick={handleRun} disabled={loading} style={{
          padding: '8px 18px', borderRadius: 8, border: 'none',
          background: loading ? 'var(--border)' : 'var(--accent)',
          color: '#fff', fontWeight: 700, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? `Searching… ${progress}%` : '🔍 Find Best Parks'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '10px 14px', borderRadius: 8,
          background: '#3a1a1a', color: 'var(--danger)',
          fontSize: 13, border: '1px solid var(--danger)',
        }}>{error}</div>
      )}

      {loading && (
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'var(--accent)', transition: 'width 0.3s',
          }} />
        </div>
      )}

      {results.map((r, i) => (
        <div key={r.park.code} style={{
          background: 'var(--surface2)', borderRadius: 'var(--radius)',
          padding: 16, border: `1px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: i === 0 ? 'var(--accent)' : 'var(--surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 15, color: '#fff', flexShrink: 0,
            }}>#{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{r.park.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{r.park.state}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {r.flightCosts.map(fc => (
                  <div key={fc.personId} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 13, color: 'var(--accent2)',
                  }}>
                    <span>{fc.name}</span>
                    <span style={{ fontWeight: 600 }}>
                      {fc.cost === 0 ? '🏠 Local' : `$${fc.cost.toFixed(0)}`}
                    </span>
                  </div>
                ))}
                <div style={{
                  borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4,
                  display: 'flex', justifyContent: 'space-between',
                  fontWeight: 700, fontSize: 14,
                }}>
                  <span>Total Group Cost</span>
                  <span style={{ color: 'var(--accent)' }}>${r.totalCost.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}