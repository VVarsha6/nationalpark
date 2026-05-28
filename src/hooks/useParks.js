import { useState, useEffect } from 'react'
import { fetchAllParks } from '../services/nps'

export function useParks() {
  const [parks, setParks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAllParks()
      .then(setParks)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { parks, loading, error }
}