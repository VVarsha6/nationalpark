import React, { useState, useEffect } from 'react'

const FIELD = (label, key, type = 'text', placeholder = '') => ({ label, key, type, placeholder })
const FIELDS = [
  FIELD('Name', 'name', 'text', 'e.g. Alice'),
  FIELD('Airport IATA codes (comma separated)', 'airportsRaw', 'text', 'e.g. SFO, OAK'),
  FIELD('Budget (USD, leave blank = unlimited)', 'budget', 'number', 'e.g. 400'),
]

export default function PersonModal({ person, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    airportsRaw: '',
    budget: '',
    ...person,
    airportsRaw: person?.airports?.join(', ') || '',
  })

  const handleSave = () => {
    if (!form.name.trim()) return
    const airports = form.airportsRaw
      .split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
    onSave({ ...form, airports })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius)',
        padding: 28, width: 400, maxWidth: '95vw',
        border: '1px solid var(--border)',
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: 20, color: 'var(--accent)' }}>
          {person ? 'Edit Person' : 'Add Person'}
        </h2>
        {FIELDS.map(f => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--muted)' }}>
              {f.label}
            </label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key] || ''}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              style={{
                width: '100%', padding: '9px 12px', borderRadius: 8,
                border: '1px solid var(--border)', background: 'var(--surface2)',
                color: 'var(--text)', fontSize: 14, outline: 'none',
              }}
            />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button onClick={onClose} style={{
            padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--muted)', fontWeight: 600,
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none',
            background: 'var(--accent)', color: '#fff', fontWeight: 600,
          }}>Save</button>
        </div>
      </div>
    </div>
  )
}