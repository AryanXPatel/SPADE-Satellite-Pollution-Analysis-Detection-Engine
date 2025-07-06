"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useOpenMeteoData } from "@/hooks/use-open-meteo-data"
import { RefreshCw, Thermometer, Droplets, Wind, Eye, Sun } from "lucide-react"

interface OpenMeteoDashboardProps {
  latitude: number
  longitude: number
  cityName?: string
}

export function OpenMeteoDashboard({ latitude, longitude, cityName = "Selected Location" }: OpenMeteoDashboardProps) {
  const { currentAirQuality, currentWeather, forecastData, isLoading, error, lastUpdate, refresh } = useOpenMeteoData({
    latitude,
    longitude,
    forecastDays: 7,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-800 mb-4">Error loading data: {error}</p>
            <Button onClick={refresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{cityName}</h2>
          <p className="text-gray-600">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
          {lastUpdate && <p className="text-sm text-gray-500">Last updated: {lastUpdate.toLocaleTimeString()}</p>}
        </div>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Current Air Quality */}
      {currentAirQuality && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentAirQuality.aqi.color }} />
              Current Air Quality
            </CardTitle>
            <CardDescription>Real-time pollution measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: currentAirQuality.aqi.color }}>
                  {currentAirQuality.aqi.value}
                </div>
                <div className="text-sm text-gray-600">AQI</div>
                <Badge className="mt-1" style={{ backgroundColor: currentAirQuality.aqi.color, color: "white" }}>
                  {currentAirQuality.aqi.category}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{currentAirQuality.pm25.toFixed(1)}</div>
                <div className="text-sm text-gray-600">PM2.5 µg/m³</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{currentAirQuality.pm10.toFixed(1)}</div>
                <div className="text-sm text-gray-600">PM10 µg/m³</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{currentAirQuality.o3.toFixed(1)}</div>
                <div className="text-sm text-gray-600">O₃ µg/m³</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Weather */}
      {currentWeather && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Current Weather
            </CardTitle>
            <CardDescription>Meteorological conditions affecting air quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="font-semibold">{currentWeather.temperature.toFixed(1)}°C</div>
                  <div className="text-sm text-gray-600">Temperature</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-semibold">{currentWeather.humidity}%</div>
                  <div className="text-sm text-gray-600">Humidity</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-semibold">{currentWeather.windSpeed.toFixed(1)} km/h</div>
                  <div className="text-sm text-gray-600">Wind Speed</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="font-semibold">{currentWeather.pressure.toFixed(0)} hPa</div>
                  <div className="text-sm text-gray-600">Pressure</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-yellow-500" />
                <div>
                  <div className="font-semibold">{currentWeather.cloudCover}%</div>
                  <div className="text-sm text-gray-600">Cloud Cover</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 7-Day Forecast Preview */}
      {forecastData && forecastData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>7-Day Air Quality Forecast</CardTitle>
            <CardDescription>Predicted pollution levels and health recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forecastData
                .slice(0, 7 * 4)
                .filter((_: any, index: number) => index % 6 === 0)
                .map((point: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {new Date(point.timestamp).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        {point.weatherFactors.temperature.toFixed(0)}°C, {point.weatherFactors.humidity}% humidity
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold" style={{ color: point.aqi.color }}>
                        PM2.5: {point.pm25.toFixed(0)}
                      </div>
                      <Badge style={{ backgroundColor: point.aqi.color, color: "white" }} className="text-xs">
                        {point.aqi.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{point.confidence}% confidence</div>
                      <div className="text-xs text-gray-600">
                        {point.healthRecommendations[0]
                          ?.replace(/[🚨⚠️👥✅🌱💧🏥😷🏠🚶‍♀️🏃‍♂️☀️]/gu, "")
                          .trim()
                          .substring(0, 30)}
                        ...
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
