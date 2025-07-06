// Open-Meteo API client - Completely free, no API key required!

interface AirQualityData {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  hourly_units: {
    time: string
    pm10: string
    pm2_5: string
    carbon_monoxide: string
    nitrogen_dioxide: string
    sulphur_dioxide: string
    ozone: string
    aerosol_optical_depth: string
    dust: string
    uv_index: string
    uv_index_clear_sky: string
    ammonia: string
    alder_pollen: string
    birch_pollen: string
    grass_pollen: string
    mugwort_pollen: string
    olive_pollen: string
    ragweed_pollen: string
  }
  hourly: {
    time: string[]
    pm10: number[]
    pm2_5: number[]
    carbon_monoxide: number[]
    nitrogen_dioxide: number[]
    sulphur_dioxide: number[]
    ozone: number[]
    aerosol_optical_depth: number[]
    dust: number[]
    uv_index: number[]
    uv_index_clear_sky: number[]
    ammonia: number[]
    alder_pollen: number[]
    birch_pollen: number[]
    grass_pollen: number[]
    mugwort_pollen: number[]
    olive_pollen: number[]
    ragweed_pollen: number[]
  }
}

interface WeatherData {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: any
  current: {
    time: string
    interval: number
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    is_day: number
    precipitation: number
    rain: number
    showers: number
    snowfall: number
    weather_code: number
    cloud_cover: number
    pressure_msl: number
    surface_pressure: number
    wind_speed_10m: number
    wind_direction_10m: number
    wind_gusts_10m: number
  }
  hourly_units: any
  hourly: {
    time: string[]
    temperature_2m: number[]
    relative_humidity_2m: number[]
    dew_point_2m: number[]
    apparent_temperature: number[]
    precipitation_probability: number[]
    precipitation: number[]
    rain: number[]
    showers: number[]
    snowfall: number[]
    snow_depth: number[]
    weather_code: number[]
    pressure_msl: number[]
    surface_pressure: number[]
    cloud_cover: number[]
    visibility: number[]
    evapotranspiration: number[]
    wind_speed_10m: number[]
    wind_direction_10m: number[]
    wind_gusts_10m: number[]
    soil_temperature_0cm: number[]
    soil_moisture_0_to_1cm: number[]
  }
  daily_units: any
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    apparent_temperature_max: number[]
    apparent_temperature_min: number[]
    sunrise: string[]
    sunset: string[]
    daylight_duration: number[]
    sunshine_duration: number[]
    uv_index_max: number[]
    uv_index_clear_sky_max: number[]
    precipitation_sum: number[]
    rain_sum: number[]
    showers_sum: number[]
    snowfall_sum: number[]
    precipitation_hours: number[]
    precipitation_probability_max: number[]
    wind_speed_10m_max: number[]
    wind_gusts_10m_max: number[]
    wind_direction_10m_dominant: number[]
    shortwave_radiation_sum: number[]
  }
}

export class OpenMeteoClient {
  private airQualityBaseUrl = "https://air-quality-api.open-meteo.com/v1/air-quality"
  private weatherBaseUrl = "https://api.open-meteo.com/v1/forecast"
  private historicalBaseUrl = "https://archive-api.open-meteo.com/v1/archive"
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTTL = 15 * 60 * 1000 // 15 minutes

  async getAirQuality(
    lat: number,
    lon: number,
    options: {
      hourly?: string[]
      days?: number
      startDate?: string
      endDate?: string
    } = {},
  ): Promise<AirQualityData | null> {
    const cacheKey = `air-quality-${lat}-${lon}-${JSON.stringify(options)}`

    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey)
    }

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      timezone: "auto",
    })

    // Default hourly parameters for comprehensive air quality data
    const defaultHourly = [
      "pm10",
      "pm2_5",
      "carbon_monoxide",
      "nitrogen_dioxide",
      "sulphur_dioxide",
      "ozone",
      "aerosol_optical_depth",
      "dust",
      "uv_index",
      "ammonia",
    ]

    params.append("hourly", (options.hourly || defaultHourly).join(","))

    if (options.days) {
      params.append("forecast_days", options.days.toString())
    }

    if (options.startDate) {
      params.append("start_date", options.startDate)
    }

    if (options.endDate) {
      params.append("end_date", options.endDate)
    }

    try {
      const response = await fetch(`${this.airQualityBaseUrl}?${params}`)
      if (!response.ok) {
        throw new Error(`Open-Meteo Air Quality API error: ${response.status}`)
      }

      const data = await response.json()
      this.setCache(cacheKey, data)
      return data
    } catch (error) {
      console.error("Open-Meteo air quality fetch error:", error)
      return null
    }
  }

  async getWeatherForecast(
    lat: number,
    lon: number,
    options: {
      days?: number
      hourly?: string[]
      daily?: string[]
      current?: string[]
    } = {},
  ): Promise<WeatherData | null> {
    const cacheKey = `weather-${lat}-${lon}-${JSON.stringify(options)}`

    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey)
    }

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      timezone: "auto",
    })

    // Comprehensive current weather parameters
    const defaultCurrent = [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "rain",
      "showers",
      "snowfall",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "surface_pressure",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
    ]

    // Comprehensive hourly parameters
    const defaultHourly = [
      "temperature_2m",
      "relative_humidity_2m",
      "dew_point_2m",
      "apparent_temperature",
      "precipitation_probability",
      "precipitation",
      "rain",
      "showers",
      "snowfall",
      "snow_depth",
      "weather_code",
      "pressure_msl",
      "surface_pressure",
      "cloud_cover",
      "visibility",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
      "soil_temperature_0cm",
      "soil_moisture_0_to_1cm",
    ]

    // Comprehensive daily parameters
    const defaultDaily = [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "sunrise",
      "sunset",
      "daylight_duration",
      "sunshine_duration",
      "uv_index_max",
      "precipitation_sum",
      "rain_sum",
      "showers_sum",
      "snowfall_sum",
      "precipitation_hours",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "wind_gusts_10m_max",
      "wind_direction_10m_dominant",
      "shortwave_radiation_sum",
    ]

    params.append("current", (options.current || defaultCurrent).join(","))
    params.append("hourly", (options.hourly || defaultHourly).join(","))
    params.append("daily", (options.daily || defaultDaily).join(","))

    if (options.days) {
      params.append("forecast_days", options.days.toString())
    }

    try {
      const response = await fetch(`${this.weatherBaseUrl}?${params}`)
      if (!response.ok) {
        throw new Error(`Open-Meteo Weather API error: ${response.status}`)
      }

      const data = await response.json()
      this.setCache(cacheKey, data)
      return data
    } catch (error) {
      console.error("Open-Meteo weather fetch error:", error)
      return null
    }
  }

  async getHistoricalData(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string,
    parameters: string[] = ["temperature_2m", "relative_humidity_2m", "precipitation", "wind_speed_10m"],
  ): Promise<any> {
    const cacheKey = `historical-${lat}-${lon}-${startDate}-${endDate}`

    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey)
    }

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      start_date: startDate,
      end_date: endDate,
      hourly: parameters.join(","),
      timezone: "auto",
    })

    try {
      const response = await fetch(`${this.historicalBaseUrl}?${params}`)
      if (!response.ok) {
        throw new Error(`Open-Meteo Historical API error: ${response.status}`)
      }

      const data = await response.json()
      this.setCache(cacheKey, data)
      return data
    } catch (error) {
      console.error("Open-Meteo historical fetch error:", error)
      return null
    }
  }

  // Get air quality data for multiple Indian cities
  async getIndianCitiesAirQuality(): Promise<Array<{ city: string; lat: number; lon: number; data: AirQualityData }>> {
    const indianCities = [
      { city: "Delhi", lat: 28.6139, lon: 77.209 },
      { city: "Mumbai", lat: 19.076, lon: 72.8777 },
      { city: "Bangalore", lat: 12.9716, lon: 77.5946 },
      { city: "Chennai", lat: 13.0827, lon: 80.2707 },
      { city: "Kolkata", lat: 22.5726, lon: 88.3639 },
      { city: "Hyderabad", lat: 17.385, lon: 78.4867 },
      { city: "Pune", lat: 18.5204, lon: 73.8567 },
      { city: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
      { city: "Jaipur", lat: 26.9124, lon: 75.7873 },
      { city: "Lucknow", lat: 26.8467, lon: 80.9462 },
    ]

    const results = []

    for (const city of indianCities) {
      try {
        const data = await this.getAirQuality(city.lat, city.lon, { days: 1 })
        if (data) {
          results.push({ ...city, data })
        }
      } catch (error) {
        console.error(`Error fetching data for ${city.city}:`, error)
      }
    }

    return results
  }

  // Calculate AQI from PM2.5 values
  calculateAQI(pm25: number): { aqi: number; category: string; color: string } {
    if (pm25 <= 12) {
      return { aqi: Math.round((50 / 12) * pm25), category: "Good", color: "#00e400" }
    } else if (pm25 <= 35.4) {
      return {
        aqi: Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51),
        category: "Moderate",
        color: "#ffff00",
      }
    } else if (pm25 <= 55.4) {
      return {
        aqi: Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101),
        category: "Unhealthy for Sensitive Groups",
        color: "#ff7e00",
      }
    } else if (pm25 <= 150.4) {
      return {
        aqi: Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151),
        category: "Unhealthy",
        color: "#ff0000",
      }
    } else if (pm25 <= 250.4) {
      return {
        aqi: Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201),
        category: "Very Unhealthy",
        color: "#8f3f97",
      }
    } else {
      return {
        aqi: Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301),
        category: "Hazardous",
        color: "#7e0023",
      }
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

export const openMeteoClient = new OpenMeteoClient()
