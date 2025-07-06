// API Configuration for free/open-source services
export const API_CONFIG = {
  // OpenAQ - Free air quality data (no API key required)
  openaq: {
    baseUrl: "https://api.openaq.org/v2",
    rateLimit: {
      requestsPerHour: 2000,
      requestsPerDay: 10000,
    },
    endpoints: {
      measurements: "/measurements",
      locations: "/locations",
      countries: "/countries",
      cities: "/cities",
      parameters: "/parameters",
    },
  },

  // OpenWeatherMap - Free tier: 1,000 calls/day
  weather: {
    baseUrl: "https://api.openweathermap.org/data/2.5",
    apiKey: process.env.OPENWEATHER_API_KEY,
    rateLimit: {
      requestsPerDay: 1000,
      requestsPerMinute: 60,
    },
    endpoints: {
      current: "/weather",
      forecast: "/forecast",
      airPollution: "/air_pollution",
      airPollutionForecast: "/air_pollution/forecast",
    },
  },

  // NASA APIs - Free with API key
  nasa: {
    baseUrl: "https://api.nasa.gov",
    apiKey: process.env.NASA_API_KEY || "DEMO_KEY",
    rateLimit: {
      requestsPerHour: 1000,
    },
    endpoints: {
      earthImagery: "/planetary/earth/imagery",
      earthAssets: "/planetary/earth/assets",
    },
  },

  // Free map tile sources
  mapTiles: {
    openStreetMap: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    },
    cartoLight: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: "© OpenStreetMap contributors © CARTO",
      maxZoom: 19,
    },
    stamenTerrain: {
      url: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
      attribution: "Map tiles by Stamen Design, CC BY 3.0",
      maxZoom: 18,
    },
  },
}

export const FALLBACK_CONFIG = {
  useMockData: process.env.USE_MOCK_DATA_FALLBACK === "true",
  enableCaching: process.env.ENABLE_REQUEST_CACHING === "true",
  cacheTTL: Number.parseInt(process.env.CACHE_TTL_MINUTES || "15") * 60 * 1000,
}
