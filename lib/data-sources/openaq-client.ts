// OpenAQ API client - No API key required!
interface OpenAQMeasurement {
  locationId: number
  location: string
  parameter: string
  value: number
  unit: string
  country: string
  city: string
  coordinates: {
    latitude: number
    longitude: number
  }
  date: {
    utc: string
    local: string
  }
}

interface OpenAQLocation {
  id: number
  name: string
  entity: string
  country: string
  sources: string[]
  isMobile: boolean
  coordinates: {
    latitude: number
    longitude: number
  }
  lastUpdated: string
  parameters: string[]
}

export class OpenAQClient {
  private baseUrl = "https://api.openaq.org/v2"
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTTL = 15 * 60 * 1000 // 15 minutes

  async getLocations(
    params: {
      country?: string
      city?: string
      coordinates?: string
      radius?: number
      limit?: number
    } = {},
  ): Promise<OpenAQLocation[]> {
    const cacheKey = `locations-${JSON.stringify(params)}`

    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey)
    }

    const queryParams = new URLSearchParams()
    if (params.country) queryParams.append("country", params.country)
    if (params.city) queryParams.append("city", params.city)
    if (params.coordinates) queryParams.append("coordinates", params.coordinates)
    if (params.radius) queryParams.append("radius", params.radius.toString())
    queryParams.append("limit", (params.limit || 100).toString())

    try {
      const response = await fetch(`${this.baseUrl}/locations?${queryParams}`)
      if (!response.ok) throw new Error(`OpenAQ API error: ${response.status}`)

      const data = await response.json()
      this.setCache(cacheKey, data.results)
      return data.results
    } catch (error) {
      console.error("OpenAQ locations fetch error:", error)
      return []
    }
  }

  async getMeasurements(
    params: {
      location?: string
      parameter?: string
      country?: string
      city?: string
      coordinates?: string
      radius?: number
      dateFrom?: string
      dateTo?: string
      limit?: number
    } = {},
  ): Promise<OpenAQMeasurement[]> {
    const cacheKey = `measurements-${JSON.stringify(params)}`

    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey)
    }

    const queryParams = new URLSearchParams()
    if (params.location) queryParams.append("location", params.location)
    if (params.parameter) queryParams.append("parameter", params.parameter)
    if (params.country) queryParams.append("country", params.country)
    if (params.city) queryParams.append("city", params.city)
    if (params.coordinates) queryParams.append("coordinates", params.coordinates)
    if (params.radius) queryParams.append("radius", params.radius.toString())
    if (params.dateFrom) queryParams.append("date_from", params.dateFrom)
    if (params.dateTo) queryParams.append("date_to", params.dateTo)
    queryParams.append("limit", (params.limit || 1000).toString())
    queryParams.append("sort", "desc")

    try {
      const response = await fetch(`${this.baseUrl}/measurements?${queryParams}`)
      if (!response.ok) throw new Error(`OpenAQ API error: ${response.status}`)

      const data = await response.json()
      this.setCache(cacheKey, data.results)
      return data.results
    } catch (error) {
      console.error("OpenAQ measurements fetch error:", error)
      return []
    }
  }

  async getIndianCities(): Promise<string[]> {
    const cacheKey = "indian-cities"

    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey)
    }

    try {
      const response = await fetch(`${this.baseUrl}/cities?country=IN&limit=1000`)
      if (!response.ok) throw new Error(`OpenAQ API error: ${response.status}`)

      const data = await response.json()
      const cities = data.results.map((city: any) => city.city)
      this.setCache(cacheKey, cities)
      return cities
    } catch (error) {
      console.error("OpenAQ cities fetch error:", error)
      return []
    }
  }

  private isCached(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.cacheTTL
  }

  private getFromCache(key: string): any {
    return this.cache.get(key)?.data
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }
}

export const openaqClient = new OpenAQClient()
