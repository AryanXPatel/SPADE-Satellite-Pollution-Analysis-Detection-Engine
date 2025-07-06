"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { History, Download, Search, FileText, Database, Map, Trash2, RefreshCw } from "lucide-react"

export function ExportHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const exportHistory = [
    {
      id: "exp_001",
      filename: "pollution_map_2024_01_05.png",
      type: "map",
      format: "PNG",
      size: "2.3 MB",
      status: "completed",
      created: "2024-01-05 14:30",
      downloadCount: 3,
      expiresAt: "2024-01-12 14:30",
    },
    {
      id: "exp_002",
      filename: "station_data_december.csv",
      type: "dataset",
      format: "CSV",
      size: "15.7 MB",
      status: "completed",
      created: "2024-01-04 09:15",
      downloadCount: 1,
      expiresAt: "2024-01-11 09:15",
    },
    {
      id: "exp_003",
      filename: "model_performance_report.pdf",
      type: "report",
      format: "PDF",
      size: "4.2 MB",
      status: "processing",
      created: "2024-01-05 16:45",
      downloadCount: 0,
      expiresAt: "2024-01-12 16:45",
    },
    {
      id: "exp_004",
      filename: "bulk_export_package.zip",
      type: "bulk",
      format: "ZIP",
      size: "89.4 MB",
      status: "failed",
      created: "2024-01-03 11:20",
      downloadCount: 0,
      expiresAt: "2024-01-10 11:20",
    },
    {
      id: "exp_005",
      filename: "satellite_aod_weekly.nc",
      type: "dataset",
      format: "NetCDF",
      size: "23.1 MB",
      status: "completed",
      created: "2024-01-02 08:00",
      downloadCount: 5,
      expiresAt: "2024-01-09 08:00",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "map":
        return Map
      case "dataset":
        return Database
      case "report":
        return FileText
      case "bulk":
        return Download
      default:
        return FileText
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
      case "bulk":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredHistory = exportHistory.filter((item) => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleDownload = (item: any) => {
    // Simulate download
    console.log(`Downloading ${item.filename}`)
  }

  const handleDelete = (id: string) => {
    // Simulate delete
    console.log(`Deleting export ${id}`)
  }

  const handleRetry = (id: string) => {
    // Simulate retry
    console.log(`Retrying export ${id}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          Export History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Export History
          </DialogTitle>
          <DialogDescription>View and manage your previous data exports</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search exports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="map">Maps</SelectItem>
                <SelectItem value="dataset">Datasets</SelectItem>
                <SelectItem value="report">Reports</SelectItem>
                <SelectItem value="bulk">Bulk</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export List */}
          <div className="space-y-3">
            {filteredHistory.map((item) => {
              const Icon = getTypeIcon(item.type)
              return (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium">{item.filename}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          <span className="text-sm text-gray-500">
                            {item.format} • {item.size}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === "completed" && (
                        <Button variant="outline" size="sm" onClick={() => handleDownload(item)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {item.status === "failed" && (
                        <Button variant="outline" size="sm" onClick={() => handleRetry(item.id)}>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Retry
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Created:</span>
                      <br />
                      {item.created}
                    </div>
                    <div>
                      <span className="font-medium">Downloads:</span>
                      <br />
                      {item.downloadCount} times
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span>
                      <br />
                      {item.expiresAt}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span>
                      <br />
                      {item.size}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No exports found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't created any exports yet"}
              </p>
            </div>
          )}

          {/* Summary Stats */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">
                  {exportHistory.filter((item) => item.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {exportHistory.filter((item) => item.status === "processing").length}
                </div>
                <div className="text-sm text-gray-600">Processing</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {exportHistory.reduce((sum, item) => sum + item.downloadCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Downloads</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {exportHistory
                    .reduce((sum, item) => {
                      const size = Number.parseFloat(item.size.split(" ")[0])
                      return sum + size
                    }, 0)
                    .toFixed(1)}{" "}
                  MB
                </div>
                <div className="text-sm text-gray-600">Total Size</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
