const API_KEY = import.meta.env.VITE_NPS_API_KEY
const BASE = 'https://developer.nps.gov/api/v1'

export async function fetchAllParks() {
  let all = []
  let start = 0
  const limit = 50

  while (true) {
    const res = await fetch(
      `${BASE}/parks?limit=${limit}&start=${start}&api_key=${API_KEY}`
    )
    const data = await res.json()
    const parks = data.data || []
    all = [...all, ...parks]
    if (all.length >= data.total || parks.length === 0) break
    start += limit
  }

  // Filter to parks with valid coordinates
  return all.filter(p =>
    p.latitude && p.longitude &&
    parseFloat(p.latitude) !== 0 &&
    p.designation?.toLowerCase().includes('national park')
  ).map(p => ({
    code: p.parkCode,
    name: p.fullName,
    description: p.description,
    lat: parseFloat(p.latitude),
    lng: parseFloat(p.longitude),
    state: p.states,
    image: p.images?.[0]?.url || null,
    url: p.url,
    designation: p.designation,
  }))
}