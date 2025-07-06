"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Navigation } from "./navigation"
import { Database, Filter, Download, BarChart3, Satellite, Wind } from "lucide-react"
import { ExportDialog } from "./export-dialog"

export function DataExplorer() {
  const [selectedParameter, setSelectedParameter] = useState("pm25")
  const [selectedRegion, setSelectedRegion] = useState("all")

  const dataSources = [
    {
      name: "INSAT-3D AOD",
      type: "Satellite",
      resolution: "1km × 1km",
      frequency: "4 times/day",
      coverage: "Pan-India",
      status: "Active",
      lastUpdate: "2 hours ago",
    },
    {
      name: "CPCB Ground Stations",
      type: "Ground-based",
      resolution: "Point measurements",
      frequency: "Hourly",
      coverage: "342 stations",
      status: "Active",
      lastUpdate: "15 minutes ago",
    },
    {
      name: "MERRA-2 Reanalysis",
      type: "Meteorological",
      resolution: "0.5° × 0.625°",
      frequency: "Hourly",
      coverage: "Global",
      status: "Active",
      lastUpdate: "3 hours ago",
    },
  ]

  const correlationData = [
    { param1: "AOD", param2: "PM2.5", correlation: 0.73, significance: "High" },
    { param1: "Humidity", param2: "PM2.5", correlation: -0.42, significance: "Medium" },
    { param1: "Wind Speed", param2: "PM2.5", correlation: -0.58, significance: "High" },
    { param1: "Temperature", param2: "PM2.5", correlation: 0.31, significance: "Low" },
    { param1: "Pressure", param2: "PM2.5", correlation: 0.28, significance: "Low" },
  ]

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation)
    if (abs > 0.7) return "bg-red-100 text-red-800"
    if (abs > 0.5) return "bg-orange-100 text-orange-800"
    if (abs > 0.3) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navigation />

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Explorer</h1>
            <p className="text-gray-600 mt-2">Multi-source data integration and correlation analysis</p>
          </div>
          <ExportDialog type="dataset">
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Dataset
            </Button>
          </ExportDialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Data Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Parameter</label>
                <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pm25">PM2.5</SelectItem>
                    <SelectItem value="pm10">PM10</SelectItem>
                    <SelectItem value="aod">AOD</SelectItem>
                    <SelectItem value="humidity">Humidity</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All India</SelectItem>
                    <SelectItem value="north">North India</SelectItem>
                    <SelectItem value="south">South India</SelectItem>
                    <SelectItem value="west">West India</SelectItem>
                    <SelectItem value="east">East India</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <DatePickerWithRange />
              </div>

              <div className="flex items-end">
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="sources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="comparison">Multi-Source Comparison</TabsTrigger>
            <TabsTrigger value="correlation">Correlation Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dataSources.map((source, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {source.type === "Satellite" && <Satellite className="h-5 w-5" />}
                      {source.type === "Ground-based" && <Database className="h-5 w-5" />}
                      {source.type === "Meteorological" && <Wind className="h-5 w-5" />}
                      {source.name}
                    </CardTitle>
                    <CardDescription>{source.type} Data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Resolution:</span>
                      <span className="text-sm font-medium">{source.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Frequency:</span>
                      <span className="text-sm font-medium">{source.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Coverage:</span>
                      <span className="text-sm font-medium">{source.coverage}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge className="bg-green-100 text-green-800">{source.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Update:</span>
                      <span className="text-sm font-medium">{source.lastUpdate}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Side-by-Side Data Comparison</CardTitle>
                <CardDescription>
                  Compare measurements from different data sources for the same location and time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Multi-source time series comparison</p>
                    <p className="text-sm text-gray-500 mt-2">Satellite AOD vs Ground PM2.5 vs Meteorological data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Quality Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Satellite Coverage</span>
                    <span className="font-semibold">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ground Station Uptime</span>
                    <span className="font-semibold">96.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Data Completeness</span>
                    <span className="font-semibold">94.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Temporal Alignment</span>
                    <span className="font-semibold">±15 min</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Processing Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Records Processed</span>
                    <span className="font-semibold">2.4M today</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Quality Flags</span>
                    <span className="font-semibold">3.2% flagged</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Missing Data</span>
                    <span className="font-semibold">1.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Processing Latency</span>
                    <span className="font-semibold">&lt; 5 min</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="correlation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parameter Correlation Matrix</CardTitle>
                <CardDescription>
                  Statistical relationships between atmospheric and meteorological variables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {correlationData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {item.param1} vs {item.param2}
                        </p>
                        <p className="text-sm text-gray-600">Pearson correlation coefficient</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{item.correlation}</p>
                        <Badge className={getCorrelationColor(item.correlation)}>{item.significance}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Correlation Heatmap</CardTitle>
                <CardDescription>Visual representation of variable relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive correlation heatmap</p>
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
