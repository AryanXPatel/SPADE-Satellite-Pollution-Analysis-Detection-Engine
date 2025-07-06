"use client"

import { useState, useEffect } from "react"
import { openMeteoClient } from "@/lib/data-sources/open-meteo-client"
import { enhancedPredictor } from "@/lib/forecasting/enhanced-predictor"

interface UseOpenMeteoDataProps {
  latitude: number
  longitude: number
  forecastDays?: number
  refreshInterval?: number
}

export function useOpenMeteoData({
  latitude,
  longitude,
  forecastDays = 7,
  refreshInterval = 15 * 60 * 1000, // 15 minutes
}: UseOpenMeteoDataProps) {
  const [airQualityData, setAirQualityData] = useState<any>(null)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [forecastData, setForecastData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch air quality data
      const airQuality = await openMeteoClient.getAirQuality(latitude, longitude, {
        days: forecastDays,
      })

      // Fetch weather data
      const weather = await openMeteoClient.getWeatherForecast(latitude, longitude, {
        days: forecastDays,
      })

      // Generate enhanced forecast
      const forecast = await enhancedPredictor.generateComprehensiveForecast(latitude, longitude, forecastDays)

      setAirQualityData(airQuality)
      setWeatherData(weather)
      setForecastData(forecast)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      console.error("Open-Meteo data fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    if (latitude && longitude) {
      fetchData()
    }
  }, [latitude, longitude, forecastDays])

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval])

  // Get current air quality summary
  const getCurrentAirQuality = () => {
    if (!airQualityData || !airQualityData.hourly) return null

    const now = new Date()
    const currentHourIndex = airQualityData.hourly.time.findIndex((time: string) => {
      const timeDate = new Date(time)
      return Math.abs(timeDate.getTime() - now.getTime()) < 60 * 60 * 1000 // Within 1 hour
    })

    if (currentHourIndex === -1) return null

    const pm25 = airQualityData.hourly.pm2_5[currentHourIndex]
    const pm10 = airQualityData.hourly.pm10[currentHourIndex]
    const aqi = openMeteoClient.calculateAQI(pm25)

    return {
      pm25,
      pm10,
      co: airQualityData.hourly.carbon_monoxide[currentHourIndex],
      no2: airQualityData.hourly.nitrogen_dioxide[currentHourIndex],
      so2: airQualityData.hourly.sulphur_dioxide[currentHourIndex],
      o3: airQualityData.hourly.ozone[currentHourIndex],
      aqi,
      timestamp: airQualityData.hourly.time[currentHourIndex],
    }
  }

  // Get current weather summary
  const getCurrentWeather = () => {
    if (!weatherData || !weatherData.current) return null

    return {
      temperature: weatherData.current.temperature_2m,
      humidity: weatherData.current.relative_humidity_2m,
      windSpeed: weatherData.current.wind_speed_10m,
      windDirection: weatherData.current.wind_direction_10m,
      pressure: weatherData.current.pressure_msl,
      precipitation: weatherData.current.precipitation,
      cloudCover: weatherData.current.cloud_cover,
      weatherCode: weatherData.current.weather_code,
      isDay: weatherData.current.is_day,
    }
  }

  // Get daily summaries
  const getDailySummaries = () => {
    if (!weatherData || !weatherData.daily) return []

    return weatherData.daily.time.map((date: string, index: number) => ({
      date,
      tempMax: weatherData.daily.temperature_2m_max[index],
      tempMin: weatherData.daily.temperature_2m_min[index],
      precipitation: weatherData.daily.precipitation_sum[index],
      windSpeed: weatherData.daily.wind_speed_10m_max[index],
      uvIndex: weatherData.daily.uv_index_max[index],
      weatherCode: weatherData.daily.weather_code[index],
    }))
  }

  return {
    // Raw data
    airQualityData,
    weatherData,
    forecastData,

    // Processed data
    currentAirQuality: getCurrentAirQuality(),
    currentWeather: getCurrentWeather(),
    dailySummaries: getDailySummaries(),

    // State
    isLoading,
    error,
    lastUpdate,

    // Actions
    refresh: fetchData,
  }
}
