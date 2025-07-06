"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, X, AlertTriangle, Activity, Wifi, WifiOff } from "lucide-react"
import { useRealtimeData } from "@/hooks/use-realtime-data"

export function RealtimeAlerts() {
  const { alerts, isConnected, lastUpdate, dismissAlert, connectionStatus } = useRealtimeData()
  const [showNotification, setShowNotification] = useState(false)

  // Show notification when new alert arrives
  useEffect(() => {
    if (alerts.length > 0) {
      setShowNotification(true)
      const timer = setTimeout(() => setShowNotification(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [alerts.length])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Critical":
        return "bg-red-600 text-white border-red-600"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            {isConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
            Real-time Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Connection:</span>
            <Badge className={isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {connectionStatus}
            </Badge>
          </div>
          <div className="flex justify-between text-xs">
            <span>Last Update:</span>
            <span className="font-medium">{lastUpdate ? lastUpdate.toLocaleTimeString() : "Never"}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Active Alerts:</span>
            <Badge variant="secondary">{alerts.length}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Live Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Live Alerts
            {alerts.length > 0 && (
              <Badge className="bg-red-100 text-red-800 animate-pulse">{alerts.length} Active</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active alerts</p>
              <p className="text-xs">System monitoring in real-time</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {alerts.map((alert) => (
                <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{alert.location}</div>
                        <div className="text-xs mt-1">
                          {alert.parameter}: <strong>{alert.value} µg/m³</strong>
                          (Threshold: {alert.threshold} µg/m³)
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)} className="h-6 w-6 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Notification */}
      {showNotification && alerts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <Alert className="bg-red-50 border-red-200 shadow-lg">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="font-semibold">New Pollution Alert!</div>
              <div className="text-sm">
                {alerts[0]?.location} - {alerts[0]?.parameter}: {alerts[0]?.value} µg/m³
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
