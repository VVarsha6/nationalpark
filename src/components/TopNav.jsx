import React from 'react'

export default function TopNav({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: 60, background: 'var(--surface)',
      borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 1000,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 22 }}>🏔️</span>
        <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>
          Parks Planner
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {['Map', 'Plan'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 18px', borderRadius: 8, border: 'none',
              background: activeTab === tab ? 'var(--accent)' : 'var(--surface2)',
              color: activeTab === tab ? '#fff' : 'var(--muted)',
              fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
            }}>
            {tab}
          </button>
        ))}
      </div>
    </nav>
  )
}