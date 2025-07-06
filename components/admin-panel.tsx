"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "./navigation"
import { Upload, RefreshCw, Database, Users, Settings, Activity, Server, CheckCircle } from "lucide-react"
import { ExportHistory } from "./export-history"

export function AdminPanel() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isTraining, setIsTraining] = useState(false)

  const systemStats = {
    totalUsers: 1247,
    activeStations: 342,
    dataPoints: "2.4M",
    modelAccuracy: 84.7,
    systemUptime: 99.8,
  }

  const recentUploads = [
    { file: "cpcb_data_2024_01_05.csv", size: "2.3 MB", status: "Processed", time: "2 hours ago" },
    { file: "satellite_aod_batch_47.nc", size: "15.7 MB", status: "Processing", time: "1 hour ago" },
    { file: "merra2_weather_daily.nc", size: "8.9 MB", status: "Completed", time: "30 min ago" },
  ]

  const modelVersions = [
    { version: "v2.3.1", accuracy: 84.7, status: "Active", deployed: "2024-01-05" },
    { version: "v2.3.0", accuracy: 82.1, status: "Archived", deployed: "2024-01-01" },
    { version: "v2.2.5", accuracy: 79.8, status: "Archived", deployed: "2023-12-28" },
  ]

  const handleFileUpload = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleModelRetrain = () => {
    setIsTraining(true)
    setTimeout(() => setIsTraining(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navigation />

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">System management and model administration</p>
          </div>
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            System Healthy
          </Badge>
          <ExportHistory />
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
              <p className="text-sm text-gray-600">+12 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5" />
                Stations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.activeStations}</div>
              <p className="text-sm text-gray-600">96% online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Data Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.dataPoints}</div>
              <p className="text-sm text-gray-600">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.modelAccuracy}%</div>
              <p className="text-sm text-gray-600">Current model</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="h-5 w-5" />
                Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.systemUptime}%</div>
              <p className="text-sm text-gray-600">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="data" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="models">Model Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-6">
            {/* Data Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Data Upload
                </CardTitle>
                <CardDescription>Upload ground station data, satellite imagery, or meteorological data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Data Type</Label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>CPCB Ground Data</option>
                      <option>Satellite AOD</option>
                      <option>MERRA-2 Weather</option>
                      <option>Custom Dataset</option>
                    </select>
                  </div>
                  <div>
                    <Label>Date Range</Label>
                    <Input type="date" className="mt-1" />
                  </div>
                  <div>
                    <Label>Region</Label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>All India</option>
                      <option>North India</option>
                      <option>South India</option>
                      <option>Custom Region</option>
                    </select>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                  <Button onClick={handleFileUpload}>Select Files</Button>
                </div>

                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Uploads */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Recently processed data files and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUploads.map((upload, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{upload.file}</p>
                        <p className="text-sm text-gray-600">
                          {upload.size} • {upload.time}
                        </p>
                      </div>
                      <Badge
                        className={
                          upload.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : upload.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {upload.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            {/* Model Training */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Model Training
                </CardTitle>
                <CardDescription>Retrain the AI model with latest data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Training Data Range</Label>
                    <Input type="date" className="mt-1" />
                  </div>
                  <div>
                    <Label>Model Type</Label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>Random Forest</option>
                      <option>XGBoost</option>
                      <option>Neural Network</option>
                      <option>Ensemble</option>
                    </select>
                  </div>
                </div>

                <Button onClick={handleModelRetrain} disabled={isTraining} className="w-full">
                  {isTraining ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Training in Progress...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Start Model Training
                    </>
                  )}
                </Button>

                {isTraining && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Training Progress</span>
                      <span>Epoch 3/10</span>
                    </div>
                    <Progress value={30} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Model Versions */}
            <Card>
              <CardHeader>
                <CardTitle>Model Versions</CardTitle>
                <CardDescription>Manage different versions of the prediction model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modelVersions.map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Model {model.version}</p>
                        <p className="text-sm text-gray-600">
                          Deployed: {model.deployed} • Accuracy: {model.accuracy}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            model.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {model.status}
                        </Badge>
                        {model.status !== "Active" && (
                          <Button variant="outline" size="sm">
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">User management interface</p>
                  <p className="text-sm text-gray-500 mt-2">Add, edit, and manage user roles and permissions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>Configure system-wide settings and parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Data Refresh Interval</Label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                    </select>
                  </div>
                  <div>
                    <Label>Model Update Frequency</Label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Manual</option>
                    </select>
                  </div>
                  <div>
                    <Label>Alert Threshold (PM2.5)</Label>
                    <Input type="number" defaultValue="100" className="mt-1" />
                  </div>
                  <div>
                    <Label>Data Retention Period</Label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>1 year</option>
                      <option>2 years</option>
                      <option>5 years</option>
                      <option>Indefinite</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full">Save Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
