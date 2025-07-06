"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Satellite, AlertTriangle, Download, ExternalLink } from "lucide-react";
import { InteractiveMap } from "./interactive-map";
import { Navigation } from "./navigation";
import { ExportDialog } from "./export-dialog";
import { MapControls } from "./map-controls";
import { useVerifiedLiveData } from "@/hooks/use-verified-live-data";

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mapLayers, setMapLayers] = useState({
    pm25: true,
    pm10: false,
    aod: true,
    groundStations: true,
    meteorological: false,
  });

  // Use live data for Delhi as default
  const {
    currentSummary,
    weather,
    isLoading,
    error,
    lastUpdate,
    dataSource,
    apiUrls,
  } = useVerifiedLiveData(28.6139, 77.209); // Delhi coordinates

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navigation />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">SPADE Dashboard</h1>
          <p className="text-lg text-gray-600">
            Real-time AI-powered air quality monitoring and analysis
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge
              className={
                dataSource === "live"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {dataSource === "live" ? "🟢 Live Data" : "🟡 Mock Data"}
            </Badge>
            {lastUpdate && (
              <span className="text-sm text-gray-500">
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Live Data Alert */}
        {currentSummary && (
          <Alert
            className={`border-${currentSummary.aqi.color.replace("#", "")} bg-opacity-10`}
          >
            <AlertTriangle
              className="h-4 w-4"
              style={{ color: currentSummary.aqi.color }}
            />
            <AlertDescription>
              <strong>Live Air Quality Alert:</strong> Current AQI is{" "}
              {currentSummary.aqi.aqi} ({currentSummary.aqi.category}) with
              PM2.5 at {currentSummary.pm25?.toFixed(1)} µg/m³ in Delhi NCR
              region
              {apiUrls.airQuality && (
                <Button
                  variant="link"
                  size="sm"
                  className="ml-2 p-0 h-auto"
                  onClick={() => window.open(apiUrls.airQuality!, "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View API
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Map Controls and Live Data */}
          <div className="lg:col-span-1 space-y-4">
            <MapControls layers={mapLayers} onLayerChange={setMapLayers} />

            {/* Live Statistics */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Live Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <div className="text-gray-500 text-xs">Delhi Current</div>
                    <div className="text-xl font-bold text-gray-800">
                      {currentSummary?.pm25?.toFixed(0) || "--"}
                    </div>
                    <div className="text-xs text-gray-500">µg/m³ PM2.5</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <div className="text-gray-500 text-xs">AQI Category</div>
                    <div
                      className="text-lg font-bold"
                      style={{ color: currentSummary?.aqi.color || "#666" }}
                    >
                      {currentSummary?.aqi.category || "Loading..."}
                    </div>
                    <div className="text-xs text-gray-500">Live Status</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <div className="text-gray-500 text-xs">Temperature</div>
                    <div className="text-xl font-bold text-blue-600">
                      {weather?.current?.temperature_2m?.toFixed(0) || "--"}°C
                    </div>
                    <div className="text-xs text-gray-500">Current</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clean Interactive Map */}
          <div className="lg:col-span-4">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Satellite className="h-5 w-5" />
                    Real-time PM2.5 Concentration Map
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={
                        dataSource === "live"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }
                    >
                      {dataSource === "live" ? "Live Data" : "Demo Mode"}
                    </Badge>
                    <ExportDialog
                      type="map"
                      data={{
                        layers: mapLayers,
                        selectedDate,
                        liveData: currentSummary,
                      }}
                    >
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </ExportDialog>
                  </div>
                </CardTitle>
                <CardDescription>
                  Interactive map showing live Open-Meteo data, ground
                  measurements, and AI predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full p-0">
                <InteractiveMap layers={mapLayers} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">API Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Air Quality API</span>
                  <Badge
                    className={
                      dataSource === "live"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {dataSource === "live" ? "Connected" : "Error"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Weather API</span>
                  <Badge
                    className={
                      weather
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {weather ? "Connected" : "Error"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Update</span>
                  <span className="font-semibold text-sm">
                    {lastUpdate ? lastUpdate.toLocaleTimeString() : "Never"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Open-Meteo API</span>
                  <span className="font-semibold">Free Tier</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Coverage</span>
                  <span className="font-semibold">Global</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Update Frequency
                  </span>
                  <span className="font-semibold">Hourly</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">API Response</span>
                  <span className="font-semibold">
                    {isLoading ? "Loading..." : error ? "Error" : "< 2s"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data Quality</span>
                  <span className="font-semibold">
                    {currentSummary ? "Excellent" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cache Status</span>
                  <span className="font-semibold">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
