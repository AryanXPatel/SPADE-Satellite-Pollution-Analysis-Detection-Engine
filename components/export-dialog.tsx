"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, FileImage, FileText, Database, Map, Settings, CheckCircle, AlertCircle } from "lucide-react"

interface ExportDialogProps {
  type: "map" | "dataset" | "report"
  data?: any
  children?: React.ReactNode
}

export function ExportDialog({ type, data, children }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState("")
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    includeTimestamp: true,
    compressData: false,
    highResolution: false,
  })
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  })
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])
  const [customFilename, setCustomFilename] = useState("")
  const [exportProgress, setExportProgress] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const mapFormats = [
    { value: "png", label: "PNG Image", description: "High-quality raster image", icon: FileImage },
    { value: "pdf", label: "PDF Document", description: "Vector-based printable format", icon: FileText },
    { value: "geotiff", label: "GeoTIFF", description: "Georeferenced raster data", icon: Map },
    { value: "kml", label: "KML/KMZ", description: "Google Earth compatible", icon: Map },
    { value: "svg", label: "SVG Vector", description: "Scalable vector graphics", icon: FileImage },
  ]

  const datasetFormats = [
    { value: "csv", label: "CSV", description: "Comma-separated values", icon: FileText },
    { value: "json", label: "JSON", description: "JavaScript Object Notation", icon: Database },
    { value: "xlsx", label: "Excel", description: "Microsoft Excel format", icon: FileText },
    { value: "netcdf", label: "NetCDF", description: "Scientific data format", icon: Database },
    { value: "hdf5", label: "HDF5", description: "Hierarchical data format", icon: Database },
  ]

  const reportFormats = [
    { value: "pdf", label: "PDF Report", description: "Complete analysis report", icon: FileText },
    { value: "docx", label: "Word Document", description: "Editable document format", icon: FileText },
    { value: "html", label: "HTML Report", description: "Web-based interactive report", icon: FileText },
  ]

  const availableLayers = [
    { id: "pm25", label: "PM2.5 Concentration", size: "2.3 MB" },
    { id: "pm10", label: "PM10 Concentration", size: "2.1 MB" },
    { id: "aod", label: "Aerosol Optical Depth", size: "4.7 MB" },
    { id: "stations", label: "Ground Station Data", size: "0.8 MB" },
    { id: "weather", label: "Meteorological Data", size: "3.2 MB" },
  ]

  const getFormats = () => {
    switch (type) {
      case "map":
        return mapFormats
      case "dataset":
        return datasetFormats
      case "report":
        return reportFormats
      default:
        return []
    }
  }

  const getDefaultFilename = () => {
    const date = new Date().toISOString().split("T")[0]
    switch (type) {
      case "map":
        return `pollution_map_${date}`
      case "dataset":
        return `pollution_data_${date}`
      case "report":
        return `pollution_report_${date}`
      default:
        return `export_${date}`
    }
  }

  const handleExport = async () => {
    if (!exportFormat) return

    setIsExporting(true)
    setExportProgress(0)
    setExportComplete(false)

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsExporting(false)
          setExportComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simulate actual export logic
    try {
      await simulateExport()
    } catch (error) {
      console.error("Export failed:", error)
      setIsExporting(false)
    }
  }

  const simulateExport = async () => {
    // This would be replaced with actual export logic
    return new Promise((resolve) => {
      setTimeout(resolve, 3000)
    })
  }

  const handleLayerToggle = (layerId: string) => {
    setSelectedLayers((prev) => (prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]))
  }

  const getTotalSize = () => {
    return selectedLayers
      .reduce((total, layerId) => {
        const layer = availableLayers.find((l) => l.id === layerId)
        if (layer) {
          const size = Number.parseFloat(layer.size.split(" ")[0])
          return total + size
        }
        return total
      }, 0)
      .toFixed(1)
  }

  const getIcon = () => {
    switch (type) {
      case "map":
        return Map
      case "dataset":
        return Database
      case "report":
        return FileText
      default:
        return Download
    }
  }

  const Icon = getIcon()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export {type === "map" ? "Map" : type === "dataset" ? "Data" : "Report"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Export {type === "map" ? "Map" : type === "dataset" ? "Dataset" : "Report"}
          </DialogTitle>
          <DialogDescription>Choose format and options for your {type} export</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Export Format</Label>
            <div className="grid grid-cols-1 gap-3">
              {getFormats().map((format) => (
                <div
                  key={format.value}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    exportFormat === format.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setExportFormat(format.value)}
                >
                  <div className="flex items-center gap-3">
                    <format.icon className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-medium">{format.label}</div>
                      <div className="text-sm text-gray-600">{format.description}</div>
                    </div>
                    {exportFormat === format.value && <CheckCircle className="h-5 w-5 text-blue-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Layer Selection (for dataset exports) */}
          {type === "dataset" && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Data Layers</Label>
              <div className="space-y-2">
                {availableLayers.map((layer) => (
                  <div key={layer.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={layer.id}
                        checked={selectedLayers.includes(layer.id)}
                        onCheckedChange={() => handleLayerToggle(layer.id)}
                      />
                      <Label htmlFor={layer.id} className="font-medium">
                        {layer.label}
                      </Label>
                    </div>
                    <Badge variant="secondary">{layer.size}</Badge>
                  </div>
                ))}
              </div>
              {selectedLayers.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Total estimated size: <strong>{getTotalSize()} MB</strong>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Date Range Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Date Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Export Options</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metadata"
                  checked={exportOptions.includeMetadata}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({ ...prev, includeMetadata: checked as boolean }))
                  }
                />
                <Label htmlFor="metadata">Include metadata and data sources</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timestamp"
                  checked={exportOptions.includeTimestamp}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({ ...prev, includeTimestamp: checked as boolean }))
                  }
                />
                <Label htmlFor="timestamp">Include timestamp in filename</Label>
              </div>
              {type === "dataset" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compress"
                    checked={exportOptions.compressData}
                    onCheckedChange={(checked) =>
                      setExportOptions((prev) => ({ ...prev, compressData: checked as boolean }))
                    }
                  />
                  <Label htmlFor="compress">Compress data (ZIP format)</Label>
                </div>
              )}
              {type === "map" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="highres"
                    checked={exportOptions.highResolution}
                    onCheckedChange={(checked) =>
                      setExportOptions((prev) => ({ ...prev, highResolution: checked as boolean }))
                    }
                  />
                  <Label htmlFor="highres">High resolution (300 DPI)</Label>
                </div>
              )}
            </div>
          </div>

          {/* Custom Filename */}
          <div className="space-y-2">
            <Label htmlFor="filename">Custom Filename (optional)</Label>
            <Input
              id="filename"
              placeholder={getDefaultFilename()}
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
            />
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Preparing export...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} />
            </div>
          )}

          {/* Export Complete */}
          {exportComplete && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Export completed successfully! Your download should start automatically.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={!exportFormat || isExporting || (type === "dataset" && selectedLayers.length === 0)}
            >
              {isExporting ? (
                <>
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export {type === "map" ? "Map" : type === "dataset" ? "Data" : "Report"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
