"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Layers, Palette, Settings, Eye, Filter } from "lucide-react"

interface MapControlsProps {
  layers: {
    pm25: boolean
    pm10: boolean
    aod: boolean
    groundStations: boolean
    meteorological: boolean
  }
  onLayerChange: (layers: any) => void
}

export function MapControls({ layers, onLayerChange }: MapControlsProps) {
  const [opacity, setOpacity] = useState([80])
  const [colorScheme, setColorScheme] = useState("viridis")
  const [pollutantType, setPollutantType] = useState("pm25")
  const [timeFilter, setTimeFilter] = useState("current")

  const colorSchemes = [
    { value: "viridis", label: "Viridis", description: "Blue to Yellow" },
    { value: "plasma", label: "Plasma", description: "Purple to Pink" },
    { value: "inferno", label: "Inferno", description: "Black to Yellow" },
    { value: "turbo", label: "Turbo", description: "Blue to Red" },
    { value: "spectral", label: "Spectral", description: "Red to Blue" },
  ]

  const pollutantTypes = [
    { value: "pm25", label: "PM2.5", unit: "µg/m³" },
    { value: "pm10", label: "PM10", unit: "µg/m³" },
    { value: "aod", label: "AOD", unit: "unitless" },
    { value: "no2", label: "NO₂", unit: "µg/m³" },
    { value: "so2", label: "SO₂", unit: "µg/m³" },
  ]

  const handleLayerToggle = (layerKey: string) => {
    onLayerChange({
      ...layers,
      [layerKey]: !layers[layerKey as keyof typeof layers],
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Map Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="layers" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="filter">Filter</TabsTrigger>
            <TabsTrigger value="view">View</TabsTrigger>
          </TabsList>

          <TabsContent value="layers" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Data Layers
              </h4>

              {Object.entries(layers).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</label>
                    <p className="text-xs text-gray-500">
                      {key === "pm25" && "Fine particulate matter"}
                      {key === "pm10" && "Coarse particulate matter"}
                      {key === "aod" && "Satellite aerosol data"}
                      {key === "groundStations" && "CPCB monitoring stations"}
                      {key === "meteorological" && "Weather data overlay"}
                    </p>
                  </div>
                  <Switch checked={value} onCheckedChange={() => handleLayerToggle(key)} />
                </div>
              ))}
            </div>

            <div className="pt-3 border-t">
              <h4 className="font-medium mb-2">Layer Opacity</h4>
              <Slider value={opacity} onValueChange={setOpacity} max={100} step={5} className="w-full" />
              <p className="text-xs text-gray-500 mt-1">{opacity[0]}% opacity</p>
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Color Scheme
              </h4>

              <Select value={colorScheme} onValueChange={setColorScheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorSchemes.map((scheme) => (
                    <SelectItem key={scheme.value} value={scheme.value}>
                      <div>
                        <div className="font-medium">{scheme.label}</div>
                        <div className="text-xs text-gray-500">{scheme.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Primary Pollutant</h4>
              <Select value={pollutantType} onValueChange={setPollutantType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pollutantTypes.map((pollutant) => (
                    <SelectItem key={pollutant.value} value={pollutant.value}>
                      <div>
                        <div className="font-medium">{pollutant.label}</div>
                        <div className="text-xs text-gray-500">{pollutant.unit}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="filter" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Time Filter
              </h4>

              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Hour</SelectItem>
                  <SelectItem value="today">Today Average</SelectItem>
                  <SelectItem value="week">Weekly Average</SelectItem>
                  <SelectItem value="month">Monthly Average</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">AQI Threshold</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="good" defaultChecked />
                  <label htmlFor="good" className="text-sm">
                    Good (0-50)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="moderate" defaultChecked />
                  <label htmlFor="moderate" className="text-sm">
                    Moderate (51-100)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="unhealthy" defaultChecked />
                  <label htmlFor="unhealthy" className="text-sm">
                    Unhealthy (101+)
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="view" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Map View
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  India
                </Button>
                <Button variant="outline" size="sm">
                  Delhi NCR
                </Button>
                <Button variant="outline" size="sm">
                  Mumbai
                </Button>
                <Button variant="outline" size="sm">
                  Bangalore
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Map Style</h4>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" size="sm" className="justify-start bg-transparent">
                  Street Map
                </Button>
                <Button variant="outline" size="sm" className="justify-start bg-transparent">
                  Satellite
                </Button>
                <Button variant="outline" size="sm" className="justify-start bg-transparent">
                  Terrain
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
