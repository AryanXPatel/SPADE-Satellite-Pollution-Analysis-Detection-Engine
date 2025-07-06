"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useVerifiedLiveData } from "@/hooks/use-verified-live-data"
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Database,
  Thermometer,
  Wind,
  Eye,
  Activity,
  Globe,
  Clock,
  Trash2,
} from "lucide-react"

interface LiveDataVerificationPanelProps {
  latitude: number
  longitude: number
  locationName?: string
}

export function LiveDataVerificationPanel({
  latitude,
  longitude,
  locationName = "Test Location",
}: LiveDataVerificationPanelProps) {
  const [selectedTab, setSelectedTab] = useState("overview")

  const {
    airQuality,
    weather,
    currentSummary,
    isLoading,
    error,
    lastUpdate,
    apiUrls,
    dataSource,
    refresh,
    clearCache,
    cacheStats,
  } = useVerifiedLiveData(latitude, longitude, 5 * 60 * 1000) // 5 minute refresh

  const getDataSourceBadge = () => {
    switch (dataSource) {
      case "live":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        )
      case "mock":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Mock Data
          </Badge>
        )
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6" />
            Live Data Verification - {locationName}
          </h2>
          <p className="text-gray-600">
            Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
          {lastUpdate && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last updated: {lastUpdate.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getDataSourceBadge()}
          <Button onClick={refresh} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={clearCache} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>API Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Fetching live data from Open-Meteo APIs...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="air-quality">Air Quality</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Current Summary */}
          {currentSummary && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Current Conditions
                </CardTitle>
                <CardDescription>Live data from Open-Meteo APIs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold" style={{ color: currentSummary.aqi.color }}>
                      {currentSummary.aqi.aqi}
                    </div>
                    <div className="text-sm text-gray-600">AQI</div>
                    <Badge className="mt-1" style={{ backgroundColor: currentSummary.aqi.color, color: "white" }}>
                      {currentSummary.aqi.category}
                    </Badge>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold">{currentSummary.pm25?.toFixed(1) || "N/A"}</div>
                    <div className="text-sm text-gray-600">PM2.5 µg/m³</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold">{currentSummary.pm10?.toFixed(1) || "N/A"}</div>
                    <div className="text-sm text-gray-600">PM10 µg/m³</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold">{weather?.current?.temperature_2m?.toFixed(1) || "N/A"}°C</div>
                    <div className="text-sm text-gray-600">Temperature</div>
                  </div>
                </div>

                {/* Health Advice */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Health Advice:</strong> {currentSummary.aqi.healthAdvice}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Air Quality API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    {airQuality ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Points:</span>
                    <span className="font-medium">{airQuality?.hourly?.time?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Generation Time:</span>
                    <span className="font-medium">{airQuality?.generationtime_ms || 0}ms</span>
                  </div>
                  {apiUrls.airQuality && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 bg-transparent"
                      onClick={() => window.open(apiUrls.airQuality!, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View API URL
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Weather API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    {weather ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Elevation:</span>
                    <span className="font-medium">{weather?.elevation || 0}m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Generation Time:</span>
                    <span className="font-medium">{weather?.generationtime_ms || 0}ms</span>
                  </div>
                  {apiUrls.weather && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 bg-transparent"
                      onClick={() => window.open(apiUrls.weather!, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View API URL
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="air-quality" className="space-y-4">
          {airQuality ? (
            <Card>
              <CardHeader>
                <CardTitle>Air Quality Data Verification</CardTitle>
                <CardDescription>Live data from: {apiUrls.airQuality?.substring(0, 80)}...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Raw Data Sample */}
                  <div>
                    <h4 className="font-medium mb-2">Latest Measurements:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {airQuality.hourly.pm2_5.slice(-1).map((value: number | null, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <div className="text-lg font-bold">{value?.toFixed(1) || "N/A"}</div>
                          <div className="text-sm text-gray-600">PM2.5 µg/m³</div>
                        </div>
                      ))}
                      {airQuality.hourly.pm10.slice(-1).map((value: number | null, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <div className="text-lg font-bold">{value?.toFixed(1) || "N/A"}</div>
                          <div className="text-sm text-gray-600">PM10 µg/m³</div>
                        </div>
                      ))}
                      {airQuality.hourly.ozone?.slice(-1).map((value: number | null, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <div className="text-lg font-bold">{value?.toFixed(1) || "N/A"}</div>
                          <div className="text-sm text-gray-600">O₃ µg/m³</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Quality Indicators */}
                  <div>
                    <h4 className="font-medium mb-2">Data Quality:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{airQuality.hourly.time.length}</div>
                        <div className="text-sm text-gray-600">Total Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{airQuality.timezone}</div>
                        <div className="text-sm text-gray-600">Timezone</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{airQuality.generationtime_ms}ms</div>
                        <div className="text-sm text-gray-600">API Response</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">
                          {new Date(airQuality.hourly.time[airQuality.hourly.time.length - 1]).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">Latest Data</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">No air quality data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          {weather ? (
            <Card>
              <CardHeader>
                <CardTitle>Weather Data Verification</CardTitle>
                <CardDescription>Live data from: {apiUrls.weather?.substring(0, 80)}...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Weather */}
                  <div>
                    <h4 className="font-medium mb-2">Current Conditions:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="font-bold">{weather.current.temperature_2m}°C</div>
                          <div className="text-sm text-gray-600">Temperature</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-bold">{weather.current.relative_humidity_2m}%</div>
                          <div className="text-sm text-gray-600">Humidity</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <Wind className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-bold">{weather.current.wind_speed_10m} km/h</div>
                          <div className="text-sm text-gray-600">Wind Speed</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <Activity className="h-4 w-4 text-purple-500" />
                        <div>
                          <div className="font-bold">{weather.current.pressure_msl} hPa</div>
                          <div className="text-sm text-gray-600">Pressure</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Completeness */}
                  <div>
                    <h4 className="font-medium mb-2">Data Completeness:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{weather.hourly.time.length}</div>
                        <div className="text-sm text-gray-600">Hourly Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{weather.daily.time.length}</div>
                        <div className="text-sm text-gray-600">Daily Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{weather.elevation}m</div>
                        <div className="text-sm text-gray-600">Elevation</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">No weather data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* API URLs */}
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Air Quality API:</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono break-all">
                    {apiUrls.airQuality || "Not available"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Weather API:</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono break-all">
                    {apiUrls.weather?.substring(0, 200) + "..." || "Not available"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cache Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Cache Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Cache Size:</span>
                  <span className="font-medium">{cacheStats.size} entries</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">TTL:</span>
                  <span className="font-medium">{cacheStats.ttl / 1000 / 60} minutes</span>
                </div>
                <div>
                  <label className="text-sm font-medium">Cached Keys:</label>
                  <div className="mt-1 space-y-1">
                    {cacheStats.entries.map((key, index) => (
                      <div key={index} className="text-xs p-1 bg-gray-50 rounded">
                        {key}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Raw JSON Data Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Raw Data Preview</CardTitle>
              <CardDescription>First few entries from API responses</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="air-quality-raw">
                <TabsList>
                  <TabsTrigger value="air-quality-raw">Air Quality</TabsTrigger>
                  <TabsTrigger value="weather-raw">Weather</TabsTrigger>
                </TabsList>
                <TabsContent value="air-quality-raw">
                  <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-64">
                    {airQuality
                      ? JSON.stringify(
                          {
                            latitude: airQuality.latitude,
                            longitude: airQuality.longitude,
                            timezone: airQuality.timezone,
                            hourly_sample: {
                              time: airQuality.hourly.time.slice(0, 3),
                              pm2_5: airQuality.hourly.pm2_5.slice(0, 3),
                              pm10: airQuality.hourly.pm10.slice(0, 3),
                            },
                          },
                          null,
                          2,
                        )
                      : "No data available"}
                  </pre>
                </TabsContent>
                <TabsContent value="weather-raw">
                  <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-64">
                    {weather
                      ? JSON.stringify(
                          {
                            latitude: weather.latitude,
                            longitude: weather.longitude,
                            elevation: weather.elevation,
                            current: weather.current,
                            hourly_sample: {
                              time: weather.hourly.time.slice(0, 3),
                              temperature_2m: weather.hourly.temperature_2m.slice(0, 3),
                            },
                          },
                          null,
                          2,
                        )
                      : "No data available"}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
