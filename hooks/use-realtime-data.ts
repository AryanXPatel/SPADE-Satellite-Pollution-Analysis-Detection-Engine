"use client"

import { useState, useEffect, useRef } from "react"

interface PollutionData {
  stationId: string
  name: string
  lat: number
  lng: number
  pm25: number
  pm10: number
  aqi: string
  timestamp: string
  trend: "up" | "down" | "stable"
}

interface AlertData {
  id: string
  stationId: string
  location: string
  parameter: string
  value: number
  threshold: number
  severity: "Low" | "Medium" | "High" | "Critical"
  timestamp: string
}

export function useRealtimeData() {
  const [pollutionData, setPollutionData] = useState<PollutionData[]>([])
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize real-time connection
  useEffect(() => {
    // For hackathon demo, we'll simulate WebSocket with intervals
    // In production, this would be: new WebSocket('wss://your-api.com/pollution-stream')

    setIsConnected(true)

    // Initial data load
    generateInitialData()

    // Set up real-time updates every 30 seconds
    intervalRef.current = setInterval(() => {
      updatePollutionData()
      checkForAlerts()
      setLastUpdate(new Date())
    }, 30000) // 30 seconds for demo, could be faster

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const generateInitialData = () => {
    const stations: PollutionData[] = [
      {
        stationId: "DL001",
        name: "Delhi - Anand Vihar",
        lat: 28.6469,
        lng: 77.3152,
        pm25: 156,
        pm10: 245,
        aqi: "Severe",
        timestamp: new Date().toISOString(),
        trend: "up",
      },
      {
        stationId: "MH002",
        name: "Mumbai - Bandra Kurla",
        lat: 19.0596,
        lng: 72.8656,
        pm25: 89,
        pm10: 134,
        aqi: "Moderate",
        timestamp: new Date().toISOString(),
        trend: "stable",
      },
      {
        stationId: "KA003",
        name: "Bangalore - BTM Layout",
        lat: 12.9172,
        lng: 77.6101,
        pm25: 67,
        pm10: 98,
        aqi: "Satisfactory",
        timestamp: new Date().toISOString(),
        trend: "down",
      },
      {
        stationId: "TN004",
        name: "Chennai - Alandur",
        lat: 13.0067,
        lng: 80.2206,
        pm25: 78,
        pm10: 112,
        aqi: "Moderate",
        timestamp: new Date().toISOString(),
        trend: "stable",
      },
      {
        stationId: "WB005",
        name: "Kolkata - Rabindra Bharati",
        lat: 22.5726,
        lng: 88.3639,
        pm25: 134,
        pm10: 198,
        aqi: "Very Poor",
        timestamp: new Date().toISOString(),
        trend: "up",
      },
      {
        stationId: "TS006",
        name: "Hyderabad - Jubilee Hills",
        lat: 17.4065,
        lng: 78.4772,
        pm25: 92,
        pm10: 145,
        aqi: "Moderate",
        timestamp: new Date().toISOString(),
        trend: "down",
      },
      {
        stationId: "MH007",
        name: "Pune - Karve Road",
        lat: 18.5204,
        lng: 73.8567,
        pm25: 76,
        pm10: 118,
        aqi: "Moderate",
        timestamp: new Date().toISOString(),
        trend: "stable",
      },
      {
        stationId: "GJ008",
        name: "Ahmedabad - Maninagar",
        lat: 23.0225,
        lng: 72.5714,
        pm25: 118,
        pm10: 167,
        aqi: "Poor",
        timestamp: new Date().toISOString(),
        trend: "up",
      },
    ]

    setPollutionData(stations)
    setLastUpdate(new Date())
  }

  const updatePollutionData = () => {
    setPollutionData((prevData) =>
      prevData.map((station) => {
        // Simulate realistic pollution changes
        const change = (Math.random() - 0.5) * 20 // ±10 change
        const newPM25 = Math.max(10, Math.min(300, station.pm25 + change))
        const newPM10 = Math.max(15, Math.min(400, station.pm10 + change * 1.5))

        // Determine trend
        let trend: "up" | "down" | "stable" = "stable"
        if (change > 5) trend = "up"
        else if (change < -5) trend = "down"

        // Calculate AQI based on PM2.5
        let aqi = "Good"
        if (newPM25 > 250) aqi = "Severe"
        else if (newPM25 > 120) aqi = "Very Poor"
        else if (newPM25 > 90) aqi = "Poor"
        else if (newPM25 > 60) aqi = "Moderate"
        else if (newPM25 > 30) aqi = "Satisfactory"

        return {
          ...station,
          pm25: Math.round(newPM25),
          pm10: Math.round(newPM10),
          aqi,
          trend,
          timestamp: new Date().toISOString(),
        }
      }),
    )
  }

  const checkForAlerts = () => {
    pollutionData.forEach((station) => {
      // Check if PM2.5 exceeds threshold (100 µg/m³)
      if (station.pm25 > 100) {
        const severity = station.pm25 > 200 ? "Critical" : station.pm25 > 150 ? "High" : "Medium"

        const newAlert: AlertData = {
          id: `alert_${Date.now()}_${station.stationId}`,
          stationId: station.stationId,
          location: station.name,
          parameter: "PM2.5",
          value: station.pm25,
          threshold: 100,
          severity,
          timestamp: new Date().toISOString(),
        }

        setAlerts((prevAlerts) => {
          // Avoid duplicate alerts for same station
          const existingAlert = prevAlerts.find(
            (alert) =>
              alert.stationId === station.stationId && Date.now() - new Date(alert.timestamp).getTime() < 300000, // 5 minutes
          )

          if (!existingAlert) {
            return [newAlert, ...prevAlerts.slice(0, 9)] // Keep only 10 most recent
          }
          return prevAlerts
        })
      }
    })
  }

  const dismissAlert = (alertId: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId))
  }

  return {
    pollutionData,
    alerts,
    isConnected,
    lastUpdate,
    dismissAlert,
    connectionStatus: isConnected ? "Connected" : "Disconnected",
  }
}
