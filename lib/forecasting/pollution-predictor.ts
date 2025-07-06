// Simple pollution forecasting using weather correlation
import { weatherClient } from "../data-sources/weather-client"
import { openaqClient } from "../data-sources/openaq-client"

interface ForecastPoint {
  timestamp: number
  pm25: number
  pm10: number
  aqi: string
  confidence: number
  weatherFactors: {
    temperature: number
    humidity: number
    windSpeed: number
    pressure: number
  }
}

export class PollutionPredictor {
  async generateForecast(lat: number, lon: number, hours = 72): Promise<ForecastPoint[]> {
    try {
      // Get current pollution data
      const currentMeasurements = await openaqClient.getMeasurements({
        coordinates: `${lat},${lon}`,
        radius: 25000, // 25km radius
        parameter: "pm25",
        limit: 100,
      })

      // Get weather forecast
      const weatherForecast = await weatherClient.getWeatherForecast(lat, lon)
      const airPollutionForecast = await weatherClient.getAirPollutionForecast(lat, lon)

      if (!weatherForecast || !airPollutionForecast) {
        return this.generateMockForecast(hours)
      }

      const forecast: ForecastPoint[] = []
      const hoursToPredict = Math.min(hours, weatherForecast.list.length)

      for (let i = 0; i < hoursToPredict; i++) {
        const weatherPoint = weatherForecast.list[i]
        const pollutionPoint = airPollutionForecast.list[i] || airPollutionForecast.list[0]

        const forecastPoint: ForecastPoint = {
          timestamp: weatherPoint.dt * 1000,
          pm25: pollutionPoint.components.pm2_5 || this.estimatePM25(weatherPoint),
          pm10: pollutionPoint.components.pm10 || this.estimatePM10(weatherPoint),
          aqi: this.calculateAQI(pollutionPoint.components.pm2_5 || this.estimatePM25(weatherPoint)),
          confidence: this.calculateConfidence(i, currentMeasurements.length),
          weatherFactors: {
            temperature: weatherPoint.main.temp,
            humidity: weatherPoint.main.humidity,
            windSpeed: weatherPoint.wind.speed,
            pressure: weatherPoint.main.pressure,
          },
        }

        forecast.push(forecastPoint)
      }

      return forecast
    } catch (error) {
      console.error("Forecast generation error:", error)
      return this.generateMockForecast(hours)
    }
  }

  private estimatePM25(weatherPoint: any): number {
    // Simple estimation based on weather conditions
    const baseValue = 50 // Base PM2.5 value
    let adjustment = 0

    // High humidity increases PM2.5
    if (weatherPoint.main.humidity > 70) adjustment += 20

    // Low wind speed increases PM2.5
    if (weatherPoint.wind.speed < 2) adjustment += 15

    // Temperature inversion effects
    if (weatherPoint.main.temp < 10) adjustment += 10

    return Math.max(10, baseValue + adjustment + (Math.random() - 0.5) * 20)
  }

  private estimatePM10(weatherPoint: any): number {
    // PM10 is typically 1.5-2x PM2.5
    return this.estimatePM25(weatherPoint) * 1.7
  }

  private calculateAQI(pm25: number): string {
    if (pm25 <= 30) return "Good"
    if (pm25 <= 60) return "Satisfactory"
    if (pm25 <= 90) return "Moderate"
    if (pm25 <= 120) return "Poor"
    if (pm25 <= 250) return "Very Poor"
    return "Severe"
  }

  private calculateConfidence(hourIndex: number, dataPoints: number): number {
    // Confidence decreases with time and increases with available data
    const timeDecay = Math.max(0.3, 1 - (hourIndex / 72) * 0.7)
    const dataConfidence = Math.min(1, dataPoints / 50)
    return Math.round(timeDecay * dataConfidence * 100)
  }

  private generateMockForecast(hours: number): ForecastPoint[] {
    const forecast: ForecastPoint[] = []
    const now = Date.now()

    for (let i = 0; i < hours; i++) {
      forecast.push({
        timestamp: now + i * 60 * 60 * 1000,
        pm25: 50 + Math.random() * 100,
        pm10: 75 + Math.random() * 150,
        aqi: ["Good", "Moderate", "Poor"][Math.floor(Math.random() * 3)],
        confidence: Math.max(30, 90 - i),
        weatherFactors: {
          temperature: 20 + Math.random() * 15,
          humidity: 40 + Math.random() * 40,
          windSpeed: 1 + Math.random() * 10,
          pressure: 1010 + Math.random() * 20,
        },
      })
    }

    return forecast
  }
}

export const pollutionPredictor = new PollutionPredictor()
