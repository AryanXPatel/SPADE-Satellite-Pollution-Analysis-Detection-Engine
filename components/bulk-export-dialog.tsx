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
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Package, Calendar, Database, Map, FileText, CheckCircle } from "lucide-react"

export function BulkExportDialog({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedExports, setSelectedExports] = useState<string[]>([])
  const [exportProgress, setExportProgress] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const availableExports = [
    {
      id: "daily_maps",
      type: "map",
      title: "Daily Pollution Maps",
      description: "Last 30 days of PM2.5 concentration maps",
      format: "PNG + GeoTIFF",
      size: "245 MB",
      count: "30 files",
    },
    {
      id: "station_data",
      type: "dataset",
      title: "Ground Station Data",
      description: "Complete CPCB station measurements",
      format: "CSV + JSON",
      size: "89 MB",
      count: "342 stations",
    },
    {
      id: "satellite_aod",
      type: "dataset",
      title: "Satellite AOD Data",
      description: "INSAT-3D Aerosol Optical Depth",
      format: "NetCDF",
      size: "156 MB",
      count: "120 files",
    },
    {
      id: "weather_data",
      type: "dataset",
      title: "Meteorological Data",
      description: "MERRA-2 reanalysis weather data",
      format: "HDF5",
      size: "78 MB",
      count: "Daily files",
    },
    {
      id: "model_outputs",
      type: "dataset",
      title: "AI Model Predictions",
      description: "ML model outputs and confidence intervals",
      format: "CSV + Metadata",
      size: "34 MB",
      count: "All regions",
    },
    {
      id: "performance_reports",
      type: "report",
      title: "Performance Reports",
      description: "Model validation and accuracy reports",
      format: "PDF",
      size: "12 MB",
      count: "5 reports",
    },
  ]

  const handleExportToggle = (exportId: string) => {
    setSelectedExports((prev) => (prev.includes(exportId) ? prev.filter((id) => id !== exportId) : [...prev, exportId]))
  }

  const getTotalSize = () => {
    return selectedExports
      .reduce((total, exportId) => {
        const exportItem = availableExports.find((item) => item.id === exportId)
        if (exportItem) {
          const size = Number.parseFloat(exportItem.size.split(" ")[0])
          return total + size
        }
        return total
      }, 0)
      .toFixed(1)
  }

  const handleBulkExport = async () => {
    if (selectedExports.length === 0) return

    setIsExporting(true)
    setExportProgress(0)
    setExportComplete(false)

    // Simulate bulk export progress
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsExporting(false)
          setExportComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 500)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "map":
        return Map
      case "dataset":
        return Database
      case "report":
        return FileText
      default:
        return Package
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "map":
        return "bg-blue-100 text-blue-800"
      case "dataset":
        return "bg-green-100 text-green-800"
      case "report":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Bulk Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Bulk Data Export
          </DialogTitle>
          <DialogDescription>Select multiple datasets and maps for batch export</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="select" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select Data</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Export</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-4">
            {/* Export Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Available Exports</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedExports(availableExports.map((item) => item.id))}
                  >
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedExports([])}>
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {availableExports.map((exportItem) => {
                  const Icon = getTypeIcon(exportItem.type)
                  return (
                    <div
                      key={exportItem.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedExports.includes(exportItem.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleExportToggle(exportItem.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedExports.includes(exportItem.id)}
                          onChange={() => handleExportToggle(exportItem.id)}
                        />
                        <Icon className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{exportItem.title}</h3>
                            <Badge className={getTypeColor(exportItem.type)}>{exportItem.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{exportItem.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Format: {exportItem.format}</span>
                            <span>Size: {exportItem.size}</span>
                            <span>Count: {exportItem.count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Export Summary */}
            {selectedExports.length > 0 && (
              <Alert>
                <Package className="h-4 w-4" />
                <AlertDescription>
                  <strong>{selectedExports.length} items selected</strong> • Total size:{" "}
                  <strong>{getTotalSize()} MB</strong> • Estimated time:{" "}
                  <strong>~{Math.ceil(Number.parseFloat(getTotalSize()) / 50)} minutes</strong>
                </AlertDescription>
              </Alert>
            )}

            {/* Export Progress */}
            {isExporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Preparing bulk export...</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} />
                <p className="text-xs text-gray-600">
                  Processing {selectedExports.length} datasets. Large exports may take several minutes.
                </p>
              </div>
            )}

            {/* Export Complete */}
            {exportComplete && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Bulk export completed! A ZIP file containing all selected data has been prepared for download.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Scheduled Exports</h3>
              <p className="text-gray-600 mb-4">Set up automated data exports on a recurring schedule</p>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Configure Schedule
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleBulkExport} disabled={selectedExports.length === 0 || isExporting}>
            {isExporting ? (
              <>
                <Package className="h-4 w-4 mr-2 animate-pulse" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Selected ({selectedExports.length})
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
