"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { useRealtimeData } from "@/hooks/use-realtime-data"

export function LiveMetrics() {
  const { pollutionData, lastUpdate } = useRealtimeData()

  // Calculate real-time metrics
  const avgPM25 =
    pollutionData.length > 0
      ? Math.round(pollutionData.reduce((sum, station) => sum + station.pm25, 0) / pollutionData.length)
      : 0

  const highestPollution = pollutionData.reduce(
    (max, station) => (station.pm25 > max.pm25 ? station : max),
    pollutionData[0] || { pm25: 0, name: "N/A", aqi: "Good" },
  )

  const stationsOnline = pollutionData.length
  const criticalStations = pollutionData.filter((station) => station.pm25 > 150).length

  const getAQIColor = (aqi: string) => {
    switch (aqi) {
      case "Good":
        return "bg-green-500"
      case "Satisfactory":
        return "bg-yellow-500"
      case "Moderate":
        return "bg-orange-500"
      case "Poor":
        return "bg-red-500"
      case "Very Poor":
        return "bg-purple-500"
      case "Severe":
        return "bg-red-800"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {/* Real-time Average */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
            Live Average PM2.5
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{avgPM25}</div>
          <div className="text-sm text-gray-600">µg/m³ across {stationsOnline} stations</div>
          <div className="text-xs text-gray-500 mt-1">
            Updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : "Loading..."}
          </div>
        </CardContent>
      </Card>

      {/* Highest Pollution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Most Polluted Now</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="font-semibold text-sm">{highestPollution.name}</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{highestPollution.pm25}</span>
              <span className="text-sm text-gray-600">µg/m³</span>
              <Badge className={getAQIColor(highestPollution.aqi)}>{highestPollution.aqi}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Stations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Critical Stations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{criticalStations}</div>
          <div className="text-sm text-gray-600">Above 150 µg/m³</div>
          {criticalStations > 0 && <Badge className="bg-red-100 text-red-800 mt-2">Emergency Level</Badge>}
        </CardContent>
      </Card>

      {/* Trending Stations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pollutionData.slice(0, 3).map((station) => (
              <div key={station.stationId} className="flex items-center justify-between text-sm">
                <span className="truncate">{station.name.split(" - ")[1] || station.name}</span>
                <div className="flex items-center gap-1">
                  {station.trend === "up" && <TrendingUp className="h-3 w-3 text-red-500" />}
                  {station.trend === "down" && <TrendingDown className="h-3 w-3 text-green-500" />}
                  {station.trend === "stable" && <Activity className="h-3 w-3 text-blue-500" />}
                  <span className="font-medium">{station.pm25}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
