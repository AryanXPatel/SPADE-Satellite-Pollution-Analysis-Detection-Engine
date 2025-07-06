"use client"

import { useState, useEffect, useCallback } from "react"
import { verifiedOpenMeteoClient } from "@/lib/data-sources/verified-open-meteo-client"

interface LiveDataState {
  airQuality: any
  weather: any
  currentSummary: any
  isLoading: boolean
  error: string | null
  lastUpdate: Date | null
  apiUrls: {
    airQuality: string | null
    weather: string | null
  }
  dataSource: "live" | "mock" | "error"
}

export function useVerifiedLiveData(latitude: number, longitude: number, refreshInterval = 10 * 60 * 1000) {
  const [state, setState] = useState<LiveDataState>({
    airQuality: null,
    weather: null,
    currentSummary: null,
    isLoading: true,
    error: null,
    lastUpdate: null,
    apiUrls: {
      airQuality: null,
      weather: null,
    },
    dataSource: "live",
  })

  const fetchLiveData = useCallback(async () => {
    console.log(`🔄 Fetching live data for coordinates: ${latitude}, ${longitude}`)

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Fetch comprehensive location data
      const locationData = await verifiedOpenMeteoClient.getLocationData(latitude, longitude)

      console.log("📊 API Response Summary:", {
        airQualitySuccess: locationData.airQuality.success,
        weatherSuccess: locationData.weather.success,
        airQualityUrl: locationData.airQuality.apiUrl,
        weatherUrl: locationData.weather.apiUrl?.substring(0, 100) + "...",
        timestamp: locationData.timestamp,
      })

      // Check if we got valid data
      if (!locationData.airQuality.success && !locationData.weather.success) {
        throw new Error("Both air quality and weather APIs failed")
      }

      // Generate current summary if air quality data is available
      let currentSummary = null
      if (locationData.airQuality.success && locationData.airQuality.data) {
        currentSummary = verifiedOpenMeteoClient.getCurrentAirQualitySummary(locationData.airQuality.data)
        console.log("📈 Current Air Quality Summary:", currentSummary)
      }

      setState({
        airQuality: locationData.airQuality.data,
        weather: locationData.weather.data,
        currentSummary,
        isLoading: false,
        error: null,
        lastUpdate: new Date(),
        apiUrls: {
          airQuality: locationData.airQuality.apiUrl,
          weather: locationData.weather.apiUrl,
        },
        dataSource: "live",
      })

      console.log("✅ Live data fetch completed successfully")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error("❌ Live data fetch failed:", errorMessage)

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        dataSource: "error",
      }))
    }
  }, [latitude, longitude])

  // Initial fetch
  useEffect(() => {
    if (latitude && longitude) {
      fetchLiveData()
    }
  }, [latitude, longitude, fetchLiveData])

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchLiveData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval, fetchLiveData])

  // Manual refresh function
  const refresh = useCallback(() => {
    console.log("🔄 Manual refresh triggered")
    fetchLiveData()
  }, [fetchLiveData])

  // Clear cache function
  const clearCache = useCallback(() => {
    verifiedOpenMeteoClient.clearCache()
    console.log("🧹 Cache cleared, fetching fresh data...")
    fetchLiveData()
  }, [fetchLiveData])

  return {
    ...state,
    refresh,
    clearCache,
    cacheStats: verifiedOpenMeteoClient.getCacheStats(),
  }
}
