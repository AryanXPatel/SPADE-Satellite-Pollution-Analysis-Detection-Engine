"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation } from "./navigation"
import { BarChart3, TrendingUp, MapPin, Download, RefreshCw } from "lucide-react"
import { ExportDialog } from "./export-dialog"

export function ModelPerformance() {
  // Mock performance data
  const performanceMetrics = {
    overall: { r2: 0.847, rmse: 12.3, mae: 8.7 },
    byRegion: [
      { region: "North India", r2: 0.823, rmse: 15.2, mae: 10.1, stations: 89 },
      { region: "West India", r2: 0.871, rmse: 9.8, mae: 7.3, stations: 76 },
      { region: "South India", r2: 0.892, rmse: 8.1, mae: 6.2, stations: 94 },
      { region: "East India", r2: 0.834, rmse: 11.7, mae: 8.9, stations: 67 },
      { region: "Central India", r2: 0.856, rmse: 10.4, mae: 7.8, stations: 45 },
    ],
  }

  const stationAccuracy = [
    { id: "DL001", name: "Delhi - Anand Vihar", error: 18.5, category: "High Error" },
    { id: "MH002", name: "Mumbai - Bandra", error: 6.2, category: "Low Error" },
    { id: "KA003", name: "Bangalore - BTM", error: 4.8, category: "Low Error" },
    { id: "TN004", name: "Chennai - Alandur", error: 7.3, category: "Low Error" },
    { id: "WB005", name: "Kolkata - Rabindra", error: 12.1, category: "Medium Error" },
  ]

  const getErrorColor = (category: string) => {
    switch (category) {
      case "Low Error":
        return "bg-green-100 text-green-800"
      case "Medium Error":
        return "bg-yellow-100 text-yellow-800"
      case "High Error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navigation />

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Model Performance</h1>
            <p className="text-gray-600 mt-2">Validation metrics and accuracy analysis for AI/ML predictions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <ExportDialog type="report">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </ExportDialog>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="spatial">Spatial Analysis</TabsTrigger>
            <TabsTrigger value="temporal">Temporal Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overall Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">R² Score</CardTitle>
                  <CardDescription>Coefficient of Determination</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{performanceMetrics.overall.r2}</div>
                  <p className="text-sm text-gray-600 mt-1">84.7% variance explained</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">RMSE</CardTitle>
                  <CardDescription>Root Mean Square Error</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{performanceMetrics.overall.rmse}</div>
                  <p className="text-sm text-gray-600 mt-1">µg/m³</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">MAE</CardTitle>
                  <CardDescription>Mean Absolute Error</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{performanceMetrics.overall.mae}</div>
                  <p className="text-sm text-gray-600 mt-1">µg/m³</p>
                </CardContent>
              </Card>
            </div>

            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Regional Performance Breakdown
                </CardTitle>
                <CardDescription>Model accuracy varies by geographical region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.byRegion.map((region, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{region.region}</h3>
                        <Badge variant="secondary">{region.stations} stations</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">R²:</span>
                          <span className="font-semibold ml-2">{region.r2}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">RMSE:</span>
                          <span className="font-semibold ml-2">{region.rmse} µg/m³</span>
                        </div>
                        <div>
                          <span className="text-gray-600">MAE:</span>
                          <span className="font-semibold ml-2">{region.mae} µg/m³</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            {/* Scatter Plot Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Predicted vs Observed PM2.5</CardTitle>
                <CardDescription>
                  Scatter plot showing model predictions against CPCB ground measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive scatter plot visualization</p>
                    <p className="text-sm text-gray-500 mt-2">
                      R² = 0.847, showing strong correlation between predictions and observations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Series Error */}
            <Card>
              <CardHeader>
                <CardTitle>Model Error Over Time</CardTitle>
                <CardDescription>Daily RMSE and MAE trends for the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Time series error analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spatial" className="space-y-6">
            {/* Station-wise Accuracy */}
            <Card>
              <CardHeader>
                <CardTitle>Station-wise Prediction Accuracy</CardTitle>
                <CardDescription>Error analysis for individual CPCB monitoring stations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stationAccuracy.map((station, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{station.name}</p>
                        <p className="text-sm text-gray-600">Station ID: {station.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{station.error}% Error</p>
                        <Badge className={getErrorColor(station.category)}>{station.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Spatial Error Map */}
            <Card>
              <CardHeader>
                <CardTitle>Spatial Error Distribution</CardTitle>
                <CardDescription>Geographic distribution of prediction errors across India</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive error heatmap</p>
                    <p className="text-sm text-gray-500 mt-2">Color-coded stations showing prediction accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="temporal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Trends</CardTitle>
                <CardDescription>Historical accuracy metrics and improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Temporal performance analysis</p>
                    <p className="text-sm text-gray-500 mt-2">Model accuracy improvements and seasonal variations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
