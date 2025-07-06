// Verified Open-Meteo API client with exact endpoint matching
interface OpenMeteoAirQualityResponse {
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
    carbon_monoxide?: string
    nitrogen_dioxide?: string
    sulphur_dioxide?: string
    ozone?: string
    aerosol_optical_depth?: string
    dust?: string
    uv_index?: string
    ammonia?: string
  }
  hourly: {
    time: string[]
    pm10: (number | null)[]
    pm2_5: (number | null)[]
    carbon_monoxide?: (number | null)[]
    nitrogen_dioxide?: (number | null)[]
    sulphur_dioxide?: (number | null)[]
    ozone?: (number | null)[]
    aerosol_optical_depth?: (number | null)[]
    dust?: (number | null)[]
    uv_index?: (number | null)[]
    ammonia?: (number | null)[]
  }
}

interface OpenMeteoWeatherResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: {
    time: string
    interval: string
    temperature_2m: string
    relative_humidity_2m: string
    apparent_temperature: string
    is_day: string
    precipitation: string
    rain: string
    showers: string
    snowfall: string
    weather_code: string
    cloud_cover: string
    pressure_msl: string
    surface_pressure: string
    wind_speed_10m: string
    wind_direction_10m: string
    wind_gusts_10m: string
  }
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
    vapour_pressure_deficit: number[]
    et0_fao_evapotranspiration: number[]
    visibility: number[]
    evapotranspiration: number[]
    cloud_cover_high: number[]
    cloud_cover_mid: number[]
    cloud_cover_low: number[]
    cloud_cover: number[]
    surface_pressure: number[]
    pressure_msl: number[]
    weather_code: number[]
    wind_speed_10m: number[]
    wind_speed_80m: number[]
    wind_speed_120m: number[]
    wind_speed_180m: number[]
    wind_direction_10m: number[]
    wind_direction_80m: number[]
    wind_direction_120m: number[]
    wind_direction_180m: number[]
    wind_gusts_10m: number[]
    temperature_80m: number[]
    temperature_120m: number[]
    temperature_180m: number[]
    soil_temperature_0cm: number[]
    soil_temperature_6cm: number[]
    soil_temperature_18cm: number[]
    soil_temperature_54cm: number[]
    soil_moisture_0_to_1cm: number[]
    soil_moisture_1_to_3cm: number[]
    soil_moisture_3_to_9cm: number[]
    soil_moisture_9_to_27cm: number[]
    soil_moisture_27_to_81cm: number[]
  }
  daily_units: any
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    apparent_temperature_max: number[]
    apparent_temperature_min: number[]
    wind_speed_10m_max: number[]
    sunrise: string[]
    sunset: string[]
    daylight_duration: number[]
    sunshine_duration: number[]
    uv_index_max: number[]
    uv_index_clear_sky_max: number[]
    rain_sum: number[]
    showers_sum: number[]
    snowfall_sum: number[]
    precipitation_hours: number[]
    precipitation_sum: number[]
    precipitation_probability_max: number[]
    wind_gusts_10m_max: number[]
    wind_direction_10m_dominant: number[]
    shortwave_radiation_sum: number[]
    et0_fao_evapotranspiration: number[]
  }
}

export class VerifiedOpenMeteoClient {
  private readonly AIR_QUALITY_BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
  private readonly WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast"

  // Cache to prevent excessive API calls
  private cache = new Map<string, { data: any; timestamp: number; url: string }>()
  private readonly CACHE_TTL = 10 * 60 * 1000 // 10 minutes cache

  /**
   * Fetch air quality data using the exact API endpoint format provided
   */
  async fetchAirQualityData(
    latitude: number,
    longitude: number,
    additionalParams: string[] = [],
  ): Promise<{ data: OpenMeteoAirQualityResponse | null; apiUrl: string; success: boolean; error?: string }> {
    // Build the exact URL format as specified
    const baseParams = `latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5`
    const additionalParamsStr = additionalParams.length > 0 ? `,${additionalParams.join(",")}` : ""
    const fullUrl = `${this.AIR_QUALITY_BASE_URL}?${baseParams}${additionalParamsStr}`

    const cacheKey = `air-quality-${latitude}-${longitude}-${additionalParams.join(",")}`

    // Check cache first
    if (this.isCached(cacheKey)) {
      const cached = this.getFromCache(cacheKey)
      return {
        data: cached.data,
        apiUrl: cached.url,
        success: true,
      }
    }

    try {
      console.log(`🌍 Fetching air quality data from: ${fullUrl}`)

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "SPADE-Air-Quality-Monitor/1.0",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: OpenMeteoAirQualityResponse = await response.json()

      // Validate response structure
      if (!data.hourly || !data.hourly.time || !data.hourly.pm2_5 || !data.hourly.pm10) {
        throw new Error("Invalid API response structure")
      }

      // Cache the successful response
      this.setCache(cacheKey, data, fullUrl)

      console.log(`✅ Air quality data fetched successfully:`, {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        dataPoints: data.hourly.time.length,
        generationTime: data.generationtime_ms,
      })

      return {
        data,
        apiUrl: fullUrl,
        success: true,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.error(`❌ Air quality API error:`, errorMessage)

      return {
        data: null,
        apiUrl: fullUrl,
        success: false,
        error: errorMessage,
      }
    }
  }

  /**
   * Fetch weather data using the exact API endpoint format provided
   */
  async fetchWeatherData(
    latitude: number,
    longitude: number,
  ): Promise<{ data: OpenMeteoWeatherResponse | null; apiUrl: string; success: boolean; error?: string }> {
    // Build the exact URL format as specified (truncated for readability, but includes all parameters)
    const dailyParams = [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "wind_speed_10m_max",
      "sunrise",
      "sunset",
      "daylight_duration",
      "sunshine_duration",
      "uv_index_max",
      "uv_index_clear_sky_max",
      "rain_sum",
      "showers_sum",
      "snowfall_sum",
      "precipitation_hours",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_gusts_10m_max",
      "wind_direction_10m_dominant",
      "shortwave_radiation_sum",
      "et0_fao_evapotranspiration",
    ].join(",")

    const hourlyParams = [
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
      "vapour_pressure_deficit",
      "et0_fao_evapotranspiration",
      "visibility",
      "evapotranspiration",
      "cloud_cover_high",
      "cloud_cover_mid",
      "cloud_cover_low",
      "cloud_cover",
      "surface_pressure",
      "pressure_msl",
      "weather_code",
      "wind_speed_10m",
      "wind_speed_80m",
      "wind_speed_120m",
      "wind_speed_180m",
      "wind_direction_10m",
      "wind_direction_80m",
      "wind_direction_120m",
      "wind_direction_180m",
      "wind_gusts_10m",
      "temperature_80m",
      "temperature_120m",
      "temperature_180m",
      "soil_temperature_0cm",
      "soil_temperature_6cm",
      "soil_temperature_18cm",
      "soil_temperature_54cm",
      "soil_moisture_0_to_1cm",
      "soil_moisture_1_to_3cm",
      "soil_moisture_3_to_9cm",
      "soil_moisture_9_to_27cm",
      "soil_moisture_27_to_81cm",
    ].join(",")

    const currentParams = [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
      "precipitation",
      "rain",
      "showers",
      "snowfall",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "surface_pressure",
    ].join(",")

    const fullUrl = `${this.WEATHER_BASE_URL}?latitude=${latitude}&longitude=${longitude}&daily=${dailyParams}&hourly=${hourlyParams}&current=${currentParams}&timezone=auto`

    const cacheKey = `weather-${latitude}-${longitude}`

    // Check cache first
    if (this.isCached(cacheKey)) {
      const cached = this.getFromCache(cacheKey)
      return {
        data: cached.data,
        apiUrl: cached.url,
        success: true,
      }
    }

    try {
      console.log(`🌤️ Fetching weather data from: ${fullUrl.substring(0, 100)}...`)

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "SPADE-Air-Quality-Monitor/1.0",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: OpenMeteoWeatherResponse = await response.json()

      // Validate response structure
      if (!data.current || !data.hourly || !data.daily) {
        throw new Error("Invalid weather API response structure")
      }

      // Cache the successful response
      this.setCache(cacheKey, data, fullUrl)

      console.log(`✅ Weather data fetched successfully:`, {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        elevation: data.elevation,
        currentTemp: data.current.temperature_2m,
        generationTime: data.generationtime_ms,
      })

      return {
        data,
        apiUrl: fullUrl,
        success: true,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.error(`❌ Weather API error:`, errorMessage)

      return {
        data: null,
        apiUrl: fullUrl,
        success: false,
        error: errorMessage,
      }
    }
  }

  /**
   * Get comprehensive data for a location (combines air quality and weather)
   */
  async getLocationData(latitude: number, longitude: number) {
    const [airQualityResult, weatherResult] = await Promise.all([
      this.fetchAirQualityData(latitude, longitude, [
        "carbon_monoxide",
        "nitrogen_dioxide",
        "sulphur_dioxide",
        "ozone",
        "aerosol_optical_depth",
        "uv_index",
      ]),
      this.fetchWeatherData(latitude, longitude),
    ])

    return {
      airQuality: airQualityResult,
      weather: weatherResult,
      timestamp: new Date().toISOString(),
      location: { latitude, longitude },
    }
  }

  /**
   * Calculate AQI from PM2.5 values (US EPA standard)
   */
  calculateAQI(pm25: number | null): { aqi: number; category: string; color: string; healthAdvice: string } {
    if (pm25 === null || pm25 < 0) {
      return { aqi: 0, category: "No Data", color: "#999999", healthAdvice: "Data unavailable" }
    }

    let aqi: number
    let category: string
    let color: string
    let healthAdvice: string

    if (pm25 <= 12.0) {
      aqi = Math.round((50 / 12.0) * pm25)
      category = "Good"
      color = "#00e400"
      healthAdvice = "Air quality is satisfactory for most people"
    } else if (pm25 <= 35.4) {
      aqi = Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51)
      category = "Moderate"
      color = "#ffff00"
      healthAdvice = "Unusually sensitive people should consider reducing prolonged outdoor exertion"
    } else if (pm25 <= 55.4) {
      aqi = Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101)
      category = "Unhealthy for Sensitive Groups"
      color = "#ff7e00"
      healthAdvice = "Sensitive groups should reduce outdoor exertion"
    } else if (pm25 <= 150.4) {
      aqi = Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151)
      category = "Unhealthy"
      color = "#ff0000"
      healthAdvice = "Everyone should reduce outdoor exertion"
    } else if (pm25 <= 250.4) {
      aqi = Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201)
      category = "Very Unhealthy"
      color = "#8f3f97"
      healthAdvice = "Everyone should avoid outdoor activities"
    } else {
      aqi = Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301)
      category = "Hazardous"
      color = "#7e0023"
      healthAdvice = "Emergency conditions - everyone should avoid outdoor activities"
    }

    return { aqi, category, color, healthAdvice }
  }

  /**
   * Get current air quality summary
   */
  getCurrentAirQualitySummary(data: OpenMeteoAirQualityResponse) {
    if (!data.hourly || !data.hourly.time.length) return null

    // Get the most recent data point
    const latestIndex = data.hourly.time.length - 1
    const pm25 = data.hourly.pm2_5[latestIndex]
    const pm10 = data.hourly.pm10[latestIndex]

    const aqiInfo = this.calculateAQI(pm25)

    return {
      timestamp: data.hourly.time[latestIndex],
      pm25: pm25,
      pm10: pm10,
      co: data.hourly.carbon_monoxide?.[latestIndex] || null,
      no2: data.hourly.nitrogen_dioxide?.[latestIndex] || null,
      so2: data.hourly.sulphur_dioxide?.[latestIndex] || null,
      o3: data.hourly.ozone?.[latestIndex] || null,
      aod: data.hourly.aerosol_optical_depth?.[latestIndex] || null,
      uvIndex: data.hourly.uv_index?.[latestIndex] || null,
      aqi: aqiInfo,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
      },
    }
  }

  // Cache management methods
  private isCached(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.CACHE_TTL
  }

  private getFromCache(key: string) {
    return this.cache.get(key)!
  }

  private setCache(key: string, data: any, url: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      url,
    })
  }

  // Clear cache method for testing
  clearCache(): void {
    this.cache.clear()
    console.log("🧹 Cache cleared")
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
      ttl: this.CACHE_TTL,
    }
  }
}

export const verifiedOpenMeteoClient = new VerifiedOpenMeteoClient()
