// OpenWeatherMap client for forecasting
interface WeatherData {
  coord: { lon: number; lat: number }
  weather: Array<{ main: string; description: string }>
  main: {
    temp: number
    humidity: number
    pressure: number
  }
  wind: { speed: number; deg: number }
  dt: number
}

interface AirPollutionData {
  coord: { lon: number; lat: number }
  list: Array<{
    dt: number
    main: { aqi: number }
    components: {
      co: number
      no: number
      no2: number
      o3: number
      so2: number
      pm2_5: number
      pm10: number
      nh3: number
    }
  }>
}

export class WeatherClient {
  private apiKey: string
  private baseUrl = "https://api.openweathermap.org/data/2.5"

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || ""
    if (!this.apiKey) {
      console.warn("OpenWeatherMap API key not found. Weather features will be limited.")
    }
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
    if (!this.apiKey) return null

    try {
      const response = await fetch(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`)
      if (!response.ok) throw new Error(`Weather API error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Weather fetch error:", error)
      return null
    }
  }

  async getAirPollutionForecast(lat: number, lon: number): Promise<AirPollutionData | null> {
    if (!this.apiKey) return null

    try {
      const response = await fetch(`${this.baseUrl}/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`)
      if (!response.ok) throw new Error(`Air pollution API error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Air pollution forecast error:", error)
      return null
    }
  }

  async getWeatherForecast(lat: number, lon: number): Promise<any> {
    if (!this.apiKey) return null

    try {
      const response = await fetch(`${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`)
      if (!response.ok) throw new Error(`Forecast API error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Weather forecast error:", error)
      return null
    }
  }
}

export const weatherClient = new WeatherClient()
