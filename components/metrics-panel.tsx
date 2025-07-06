"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, TrendingDown, Activity } from "lucide-react"

export function MetricsPanel() {
  const metrics = [
    {
      title: "Current AQI",
      value: "156",
      category: "Severe",
      color: "bg-red-600",
      trend: "up",
      change: "+12%",
    },
    {
      title: "PM2.5 Avg",
      value: "89.3",
      unit: "µg/m³",
      trend: "down",
      change: "-5.2%",
    },
    {
      title: "Stations Online",
      value: "342/356",
      percentage: 96,
      trend: "stable",
    },
  ]

  const topPollutedCities = [
    { name: "Delhi NCR", aqi: 156, category: "Severe" },
    { name: "Ghaziabad", aqi: 142, category: "Very Poor" },
    { name: "Noida", aqi: 138, category: "Very Poor" },
    { name: "Faridabad", aqi: 134, category: "Very Poor" },
    { name: "Gurugram", aqi: 129, category: "Very Poor" },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
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
      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{metric.title}</span>
                {metric.trend === "up" && <TrendingUp className="h-4 w-4 text-red-500" />}
                {metric.trend === "down" && <TrendingDown className="h-4 w-4 text-green-500" />}
                {metric.trend === "stable" && <Activity className="h-4 w-4 text-blue-500" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {metric.value}
                  {metric.unit && <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>}
                </span>
                {metric.change && (
                  <span className={`text-sm ${metric.trend === "up" ? "text-red-500" : "text-green-500"}`}>
                    {metric.change}
                  </span>
                )}
              </div>
              {metric.category && <Badge className={getCategoryColor(metric.category)}>{metric.category}</Badge>}
              {metric.percentage && <Progress value={metric.percentage} className="h-2" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Polluted Cities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Most Polluted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPollutedCities.map((city, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{city.name}</p>
                  <p className="text-xs text-gray-500">AQI: {city.aqi}</p>
                </div>
                <Badge className={getCategoryColor(city.category)} variant="secondary">
                  {city.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Model Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Last Training</span>
            <span className="text-sm font-medium">2 hours ago</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Accuracy</span>
            <Badge variant="secondary">84.7%</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Data Freshness</span>
            <Badge className="bg-green-100 text-green-800">Live</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
