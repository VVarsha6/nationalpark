import React, { useState } from 'react'
import PersonCard from './PersonCard'
import PersonModal from './PersonModal'

export default function PeoplePanel({ people, parks, onAdd, onUpdate, onRemove }) {
  const [modal, setModal] = useState(null) // null | 'add' | person object

  const handleSave = (form) => {
    if (modal === 'add') {
      onAdd(form)
    } else {
      onUpdate(modal.id, form)
    }
    setModal(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent2)' }}>
          👥 Group ({people.length})
        </h2>
        <button onClick={() => setModal('add')} style={{
          padding: '6px 14px', borderRadius: 8, border: 'none',
          background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 13,
        }}>+ Add Person</button>
      </div>

      {people.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '24px 0',
          color: 'var(--muted)', fontSize: 14,
        }}>
          No people yet. Add someone to get started!
        </div>
      )}

      {people.map((p, i) => (
        <PersonCard
          key={p.id} person={p} index={i} parks={parks}
          onEdit={setModal} onRemove={onRemove}
        />
      ))}

      {modal && (
        <PersonModal
          person={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}