"use client";

import { useRef, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Maximize2, Download, Search } from "lucide-react";
import { ExportDialog } from "./export-dialog";
import dynamic from "next/dynamic";

interface MapProps {
  layers: {
    pm25: boolean;
    pm10: boolean;
    aod: boolean;
    groundStations: boolean;
    meteorological: boolean;
  };
}

function InteractiveMapComponent({ layers }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [leafletMap, setLeafletMap] = useState<any>(null);
  const markersRef = useRef<any[]>([]);
  const [leafletLib, setLeafletLib] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Mock data for demonstration with real-time updates
  const [groundStations, setGroundStations] = useState([
    {
      id: 1,
      name: "Delhi NCR",
      lat: 28.6139,
      lng: 77.209,
      pm25: 156,
      aqi: "Severe",
      trend: "up",
    },
    {
      id: 2,
      name: "Mumbai",
      lat: 19.076,
      lng: 72.8777,
      pm25: 89,
      aqi: "Moderate",
      trend: "stable",
    },
    {
      id: 3,
      name: "Bangalore",
      lat: 12.9716,
      lng: 77.5946,
      pm25: 67,
      aqi: "Satisfactory",
      trend: "down",
    },
    {
      id: 4,
      name: "Chennai",
      lat: 13.0827,
      lng: 80.2707,
      pm25: 78,
      aqi: "Moderate",
      trend: "stable",
    },
    {
      id: 5,
      name: "Kolkata",
      lat: 22.5726,
      lng: 88.3639,
      pm25: 134,
      aqi: "Very Poor",
      trend: "up",
    },
    {
      id: 6,
      name: "Hyderabad",
      lat: 17.385,
      lng: 78.4867,
      pm25: 92,
      aqi: "Moderate",
      trend: "down",
    },
  ]);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Leaflet map - only on client side
  useEffect(() => {
    if (!isClient || !mapContainer.current || leafletMap) return;

    const initializeMap = async () => {
      try {
        // Dynamically import Leaflet to avoid SSR issues
        const leafletModule = await import("leaflet");
        const L = leafletModule.default;

        // Store Leaflet reference
        setLeafletLib(L);

        // Import Leaflet CSS
        if (typeof document !== "undefined") {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        // Create map
        const map = L.map(mapContainer.current!, {
          center: [20.5937, 78.9629], // Center of India
          zoom: 5,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          dragging: true,
        });

        // Add tile layer with subtle styling
        const tileLayer = L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution: "© OpenStreetMap contributors © CARTO",
            maxZoom: 18,
            minZoom: 3,
          }
        );

        // Add fallback tile layer
        const fallbackTileLayer = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 18,
            minZoom: 3,
          }
        );

        // Try primary tile layer, fallback if it fails
        tileLayer.addTo(map);
        tileLayer.on("tileerror", () => {
          console.log("Primary tiles failed, switching to fallback");
          map.removeLayer(tileLayer);
          fallbackTileLayer.addTo(map);
        });

        setLeafletMap(map);
        setMapLoaded(true);
        addStationMarkers(map, L);

        // Handle map events
        map.on("load", () => {
          console.log("Map loaded successfully");
        });
      } catch (error) {
        console.error("Failed to initialize map:", error);
        // Fallback to a simple div with station list
        setMapLoaded(true);
      }
    };

    initializeMap();

    return () => {
      if (leafletMap) {
        leafletMap.remove();
        setLeafletMap(null);
      }
    };
  }, [isClient]); // Only depend on isClient

  // Add station markers
  const addStationMarkers = (map: any, L: any) => {
    try {
      // Clear existing markers
      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current = [];

      groundStations.forEach((station) => {
        // Create custom icon based on pollution level
        const iconHtml = `
          <div style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid white;
            background: ${getMarkerColor(station.pm25)};
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 600;
            color: white;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            position: relative;
          ">
            ${station.pm25}
            <div style="
              position: absolute;
              top: -2px;
              right: -2px;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: ${station.trend === "up" ? "#ef4444" : station.trend === "down" ? "#10b981" : "#6b7280"};
              border: 1px solid white;
            "></div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-marker",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        // Create marker
        const marker = L.marker([station.lat, station.lng], {
          icon: customIcon,
        });

        // Simplified popup content
        const popupContent = `
          <div style="font-family: system-ui; min-width: 180px; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #374151;">${station.name}</h3>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="color: #6b7280; font-size: 14px;">PM2.5:</span>
              <span style="font-weight: 700; font-size: 16px; color: ${getMarkerColor(station.pm25)};">${station.pm25} µg/m³</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #6b7280; font-size: 14px;">Status:</span>
              <span style="font-weight: 600; font-size: 14px; color: #374151;">${station.aqi}</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 200,
          className: "custom-popup",
        });

        marker.addTo(map);
        markersRef.current.push(marker);
      });
    } catch (error) {
      console.error("Error adding station markers:", error);
    }
  };

  // Get marker color based on PM2.5 value
  const getMarkerColor = (pm25: number) => {
    if (pm25 < 31) return "#10b981"; // Good - Green
    if (pm25 < 61) return "#f59e0b"; // Satisfactory - Yellow
    if (pm25 < 91) return "#f97316"; // Moderate - Orange
    if (pm25 < 121) return "#ef4444"; // Poor - Red
    if (pm25 < 251) return "#8b5cf6"; // Very Poor - Purple
    return "#7f1d1d"; // Severe - Dark Red
  };

  // Real-time data updates
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      // Update station data with realistic variations
      setGroundStations((prevStations) =>
        prevStations.map((station) => {
          const variation = (Math.random() - 0.5) * 8; // ±4 variation
          const newPM25 = Math.max(15, Math.min(300, station.pm25 + variation));

          // Determine trend
          let trend: "up" | "down" | "stable" = "stable";
          if (variation > 2) trend = "up";
          else if (variation < -2) trend = "down";

          // Update AQI based on new PM2.5 value
          let aqi = "Good";
          if (newPM25 > 250) aqi = "Severe";
          else if (newPM25 > 120) aqi = "Very Poor";
          else if (newPM25 > 90) aqi = "Poor";
          else if (newPM25 > 60) aqi = "Moderate";
          else if (newPM25 > 30) aqi = "Satisfactory";

          return {
            ...station,
            pm25: Math.round(newPM25),
            aqi,
            trend,
          };
        })
      );
    }, 15000); // Update every 15 seconds for demo

    return () => clearInterval(interval);
  }, [isClient]);

  // Update markers when data changes
  useEffect(() => {
    if (leafletMap && mapLoaded && leafletLib && isClient) {
      addStationMarkers(leafletMap, leafletLib);
    }
  }, [
    groundStations,
    leafletMap,
    mapLoaded,
    leafletLib,
    layers.groundStations,
    isClient,
  ]);

  const handleFullscreen = () => {
    if (mapContainer.current && isClient) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        mapContainer.current.requestFullscreen();
      }
    }
  };

  const exportMapData = () => {
    return {
      center: leafletMap?.getCenter(),
      zoom: leafletMap?.getZoom(),
      layers: layers,
      stations: groundStations,
      bounds: leafletMap?.getBounds(),
    };
  };

  const handleSearch = (query: string) => {
    const station = groundStations.find((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    if (station && leafletMap) {
      leafletMap.setView([station.lat, station.lng], 8);
    }
  };

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="relative h-full w-full rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
            <p className="text-sm text-slate-600">Initializing map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
      {/* Clean Map Container */}
      <div
        ref={mapContainer}
        className="absolute inset-0 z-0"
        style={{ minHeight: "400px" }}
      />

      {/* Minimal Search Bar */}
      <div className="absolute top-3 left-3 z-10">
        <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
            className="w-40 text-sm bg-transparent border-none outline-none placeholder-slate-400"
          />
        </div>
      </div>

      {/* Minimal Controls */}
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFullscreen}
          className="bg-white/95 backdrop-blur-sm border-slate-200"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <ExportDialog type="map" data={exportMapData()}>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/95 backdrop-blur-sm border-slate-200"
          >
            <Download className="h-4 w-4" />
          </Button>
        </ExportDialog>
      </div>

      {/* Satellite Coverage Indicator - Minimal */}
      {layers.aod && (
        <div className="absolute top-14 right-3 z-10">
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
          >
            <MapPin className="h-3 w-3 mr-1" />
            INSAT-3D
          </Badge>
        </div>
      )}

      {/* Clean Legend */}
      <div className="absolute bottom-3 left-3 z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 p-3">
          <h4 className="font-medium text-xs mb-2 text-slate-700">
            PM2.5 (µg/m³)
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-slate-600">0-30</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-slate-600">31-90</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-slate-600">91-150</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-slate-600">150+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {!mapLoaded && isClient && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
            <p className="text-sm text-slate-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Fallback content if map fails to load */}
      {mapLoaded && !leafletMap && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center z-20">
          <div className="text-center p-8">
            <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
            <p className="text-slate-600 mb-4">Displaying station data</p>
            <div className="grid grid-cols-1 gap-2 max-w-md">
              {groundStations.slice(0, 4).map((station) => (
                <div
                  key={station.id}
                  className="bg-white p-3 rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium text-sm">{station.name}</div>
                    <div className="text-xs text-slate-600">{station.aqi}</div>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-bold"
                      style={{ color: getMarkerColor(station.pm25) }}
                    >
                      {station.pm25}
                    </div>
                    <div className="text-xs text-slate-600">µg/m³</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export as dynamic component with SSR disabled
export const InteractiveMap = dynamic(
  () => Promise.resolve(InteractiveMapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-full w-full rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
            <p className="text-sm text-slate-600">Loading map...</p>
          </div>
        </div>
      </div>
    ),
  }
);
