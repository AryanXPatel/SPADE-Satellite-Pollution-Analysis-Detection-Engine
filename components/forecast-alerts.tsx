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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navigation } from "./navigation";
import {
  TrendingUp,
  Bell,
  MapPin,
  AlertTriangle,
  Wind,
  Plus,
  Settings,
} from "lucide-react";

export function ForecastAlerts() {
  const [alertThreshold, setAlertThreshold] = useState("100");
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const forecastData = [
    { day: "Today", pm25: 89, aqi: "Moderate", trend: "stable" },
    { day: "Tomorrow", pm25: 112, aqi: "Poor", trend: "up" },
    { day: "Day 3", pm25: 134, aqi: "Very Poor", trend: "up" },
  ];

  const activeAlerts = [
    {
      id: 1,
      location: "Delhi NCR",
      parameter: "PM2.5",
      value: 156,
      threshold: 100,
      severity: "High",
      time: "2 hours ago",
    },
    {
      id: 2,
      location: "Ghaziabad",
      parameter: "PM10",
      value: 245,
      threshold: 200,
      severity: "Critical",
      time: "1 hour ago",
    },
    {
      id: 3,
      location: "Noida",
      parameter: "PM2.5",
      value: 128,
      threshold: 120,
      severity: "Medium",
      time: "30 minutes ago",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-yellow-100 text-yellow-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "High":
        return "bg-red-100 text-red-800";
      case "Critical":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAQIColor = (aqi: string) => {
    switch (aqi) {
      case "Good":
        return "bg-green-500";
      case "Satisfactory":
        return "bg-yellow-500";
      case "Moderate":
        return "bg-orange-500";
      case "Poor":
        return "bg-red-500";
      case "Very Poor":
        return "bg-purple-500";
      case "Severe":
        return "bg-red-800";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navigation />

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Forecast & Alerts
            </h1>
            <p className="text-gray-600 mt-2">
              3-day pollution forecasts and custom alert management
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Alert
          </Button>
        </div>

        <Tabs defaultValue="forecast" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forecast">3-Day Forecast</TabsTrigger>
            <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
            <TabsTrigger value="settings">Alert Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-6">
            {/* Forecast Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {forecastData.map((forecast, index) => (
                <Card
                  key={index}
                  className={index === 0 ? "ring-2 ring-blue-500" : ""}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span>{forecast.day}</span>
                      {forecast.trend === "up" && (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      )}
                      {forecast.trend === "down" && (
                        <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
                      )}
                    </CardTitle>
                    <CardDescription>Delhi NCR Average</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {forecast.pm25}
                        </div>
                        <div className="text-sm text-gray-600">µg/m³ PM2.5</div>
                      </div>
                      <div className="flex justify-center">
                        <Badge className={getAQIColor(forecast.aqi)}>
                          {forecast.aqi}
                        </Badge>
                      </div>
                      {index === 1 && (
                        <Alert className="border-orange-200 bg-orange-50">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <AlertDescription className="text-orange-800 text-sm">
                            Expected to exceed threshold tomorrow
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Animated Forecast Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5" />
                  Animated Pollution Spread Forecast
                </CardTitle>
                <CardDescription>
                  ML-predicted PM2.5 concentration movement over next 72 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
                  {/* Animated pollution clouds */}
                  <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-red-400 rounded-full opacity-30 blur-xl animate-pulse" />
                  <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-orange-400 rounded-full opacity-25 blur-xl animate-pulse delay-1000" />
                  <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-yellow-400 rounded-full opacity-20 blur-lg animate-pulse delay-2000" />

                  <div className="text-center z-10">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Interactive animated forecast map
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Shows predicted pollution movement with wind patterns
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Influence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weather Impact Factors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Wind Speed</span>
                    <span className="font-semibold">12 km/h ↗</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Humidity</span>
                    <span className="font-semibold">68% ↑</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Temperature</span>
                    <span className="font-semibold">24°C ↓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pressure</span>
                    <span className="font-semibold">1013 hPa →</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Forecast Confidence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">24-hour</span>
                    <Badge className="bg-green-100 text-green-800">
                      High (89%)
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">48-hour</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Medium (74%)
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">72-hour</span>
                    <Badge className="bg-orange-100 text-orange-800">
                      Lower (62%)
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Model Used</span>
                    <span className="font-semibold text-sm">Ensemble ML</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Active Alerts ({activeAlerts.length})
                </CardTitle>
                <CardDescription>
                  Real-time notifications when pollution levels exceed
                  thresholds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{alert.location}</h3>
                          <p className="text-sm text-gray-600">{alert.time}</p>
                        </div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Parameter:</span>
                          <span className="font-semibold ml-2">
                            {alert.parameter}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Current:</span>
                          <span className="font-semibold ml-2">
                            {alert.value} µg/m³
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Threshold:</span>
                          <span className="font-semibold ml-2">
                            {alert.threshold} µg/m³
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alert Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Today&apos;s Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">12</div>
                  <div className="text-xs text-gray-600">
                    Today&apos;s alerts
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Most Affected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">Delhi NCR</div>
                  <p className="text-sm text-gray-600">8 active alerts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Alert Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-green-600">94%</div>
                  <p className="text-sm text-gray-600">Accuracy rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Alert Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Alert Configuration
                </CardTitle>
                <CardDescription>
                  Customize your pollution alert preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable Alerts</Label>
                    <p className="text-sm text-gray-600">
                      Receive notifications when thresholds are exceeded
                    </p>
                  </div>
                  <Switch
                    checked={alertsEnabled}
                    onCheckedChange={setAlertsEnabled}
                  />
                </div>

                <div className="space-y-3">
                  <Label>PM2.5 Alert Threshold (µg/m³)</Label>
                  <Input
                    type="number"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(e.target.value)}
                    placeholder="Enter threshold value"
                  />
                  <p className="text-sm text-gray-600">
                    You&apos;ll be notified when PM2.5 levels exceed this value
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Alert Locations</Label>
                  <div className="space-y-2">
                    {[
                      "Delhi NCR",
                      "Mumbai",
                      "Bangalore",
                      "Chennai",
                      "Kolkata",
                    ].map((city) => (
                      <div key={city} className="flex items-center space-x-2">
                        <input type="checkbox" id={city} defaultChecked />
                        <Label htmlFor={city}>{city}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Notification Methods</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email" defaultChecked />
                      <Label htmlFor="email">Email notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms" />
                      <Label htmlFor="sms">SMS alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="push" defaultChecked />
                      <Label htmlFor="push">Push notifications</Label>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Alert Settings</Button>
              </CardContent>
            </Card>

            {/* Alert History */}
            <Card>
              <CardHeader>
                <CardTitle>Alert History</CardTitle>
                <CardDescription>
                  Recent alert activity and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">156</div>
                      <div className="text-sm text-gray-600">
                        This Week&apos;s activity
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">89%</div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">2.3min</div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">94%</div>
                      <div className="text-sm text-gray-600">Delivery Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
