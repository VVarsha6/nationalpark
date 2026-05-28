import { cheapestFlight, nearestAirport } from './amadeus'

// Get a travel date ~6 weeks from now (free tier needs future dates)
function getTravelDate() {
  const d = new Date()
  d.setDate(d.getDate() + 42)
  return d.toISOString().split('T')[0]
}

export async function scoreParks({ parks, people, onProgress }) {
  const unvisited = parks.filter(park => {
    const visitedByAll = people.every(p => p.visitedParks.includes(park.code))
    const visitedBySome = people.some(p => p.visitedParks.includes(park.code))
    return !visitedBySome // exclude parks ANY person has visited
  })

  const date = getTravelDate()
  const results = []
  let processed = 0

  for (const park of unvisited.slice(0, 60)) { // cap at 60 for API limits
    const flightCosts = []
    let feasible = true

    for (const person of people) {
      const airports = person.airports || []
      if (airports.length === 0) { feasible = false; break }

      // Get nearest airport to the park
      const destIATA = await nearestAirport(park.lat, park.lng)
      if (!destIATA) { feasible = false; break }

      // Try each of person's airports, take cheapest
      let bestPrice = null
      for (const iata of airports) {
        if (iata.toUpperCase() === destIATA) {
          bestPrice = 0 // already there
          break
        }
        const price = await cheapestFlight(iata, destIATA, date)
        if (price !== null) {
          bestPrice = bestPrice === null ? price : Math.min(bestPrice, price)
        }
      }

      if (bestPrice === null) { feasible = false; break }

      // Check budget
      const budget = person.budget ? parseFloat(person.budget) : Infinity
      if (bestPrice > budget) { feasible = false; break }

      flightCosts.push({ personId: person.id, name: person.name, cost: bestPrice })
    }

    if (feasible && flightCosts.length === people.length) {
      const totalCost = flightCosts.reduce((s, f) => s + f.cost, 0)
      const maxSingleFare = Math.max(...flightCosts.map(f => f.cost))
      results.push({ park, flightCosts, totalCost, maxSingleFare })
    }

    processed++
    onProgress?.(Math.round((processed / Math.min(unvisited.length, 60)) * 100))
  }

  // Sort by total cost ascending
  results.sort((a, b) => a.totalCost - b.totalCost)
  return results.slice(0, 5)
}