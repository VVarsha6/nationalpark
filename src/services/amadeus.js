const CLIENT_ID = import.meta.env.VITE_AMADEUS_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_AMADEUS_CLIENT_SECRET
const AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token'
const SEARCH_URL = 'https://test.api.amadeus.com/v2/shopping/flight-offers'

let tokenCache = null

async function getToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token
  }
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  })
  const data = await res.json()
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }
  return tokenCache.token
}

// Returns cheapest one-way economy fare from origin IATA to destination IATA
export async function cheapestFlight(originIATA, destIATA, date) {
  try {
    const token = await getToken()
    const params = new URLSearchParams({
      originLocationCode: originIATA.toUpperCase(),
      destinationLocationCode: destIATA.toUpperCase(),
      departureDate: date, // YYYY-MM-DD
      adults: 1,
      travelClass: 'ECONOMY',
      max: 3,
      currencyCode: 'USD',
    })
    const res = await fetch(`${SEARCH_URL}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!data.data || data.data.length === 0) return null
    const prices = data.data.map(o => parseFloat(o.price.total))
    return Math.min(...prices)
  } catch {
    return null
  }
}

// Get nearest major airport IATA for a lat/lng using Amadeus airport nearest-relevant
export async function nearestAirport(lat, lng) {
  try {
    const token = await getToken()
    const res = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=${lat}&longitude=${lng}&radius=300&page[limit]=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    return data.data?.[0]?.iataCode || null
  } catch {
    return null
  }
}