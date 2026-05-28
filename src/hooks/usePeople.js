import { useState, useEffect } from 'react'

const STORAGE_KEY = 'npp_people'

export function usePeople() {
  const [people, setPeople] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people))
  }, [people])

  const addPerson = (person) => {
    const id = `p${Date.now()}`
    setPeople(prev => [...prev, { ...person, id, visitedParks: [] }])
  }

  const updatePerson = (id, updates) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const removePerson = (id) => {
    setPeople(prev => prev.filter(p => p.id !== id))
  }

  const toggleVisited = (personId, parkCode) => {
    setPeople(prev => prev.map(p => {
      if (p.id !== personId) return p
      const visited = p.visitedParks.includes(parkCode)
        ? p.visitedParks.filter(c => c !== parkCode)
        : [...p.visitedParks, parkCode]
      return { ...p, visitedParks: visited }
    }))
  }

  return { people, addPerson, updatePerson, removePerson, toggleVisited }
}