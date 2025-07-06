// Enhanced pollution forecasting using Open-Meteo data
import { openMeteoClient } from "../data-sources/open-meteo-client";

export interface EnhancedForecastPoint {
  timestamp: number;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  so2: number;
  o3: number;
  aqi: {
    aqi: number; // Change this from 'value' to 'aqi'
    category: string;
    color: string;
  };
  confidence: number;
  weatherFactors: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    precipitation: number;
    cloudCover: number;
    uvIndex: number;
  };
  healthRecommendations: string[];
}

export class EnhancedPollutionPredictor {
  async generateComprehensiveForecast(
    lat: number,
    lon: number,
    days = 7
  ): Promise<EnhancedForecastPoint[]> {
    try {
      // Get air quality forecast
      const airQualityData = await openMeteoClient.getAirQuality(lat, lon, {
        days,
      });

      // Get weather forecast
      const weatherData = await openMeteoClient.getWeatherForecast(lat, lon, {
        days,
      });

      if (!airQualityData || !weatherData) {
        return this.generateMockForecast(days * 24); // Fallback to mock data
      }

      const forecast: EnhancedForecastPoint[] = [];
      const hoursToPredict = Math.min(
        days * 24,
        airQualityData.hourly.time.length
      );

      for (let i = 0; i < hoursToPredict; i++) {
        const timestamp = new Date(airQualityData.hourly.time[i]).getTime();
        const pm25 = airQualityData.hourly.pm2_5[i] || 0;
        const pm10 = airQualityData.hourly.pm10[i] || 0;
        const co = airQualityData.hourly.carbon_monoxide[i] || 0;
        const no2 = airQualityData.hourly.nitrogen_dioxide[i] || 0;
        const so2 = airQualityData.hourly.sulphur_dioxide[i] || 0;
        const o3 = airQualityData.hourly.ozone[i] || 0;

        // Get corresponding weather data
        const weatherIndex = Math.min(i, weatherData.hourly.time.length - 1);

        const forecastPoint: EnhancedForecastPoint = {
          timestamp,
          pm25,
          pm10,
          co,
          no2,
          so2,
          o3,
          aqi: {
            aqi: openMeteoClient.calculateAQI(pm25).aqi, // Use .aqi instead of the whole object
            category: openMeteoClient.calculateAQI(pm25).category,
            color: openMeteoClient.calculateAQI(pm25).color,
          },
          confidence: this.calculateConfidence(i, days),
          weatherFactors: {
            temperature: weatherData.hourly.temperature_2m[weatherIndex] || 20,
            humidity:
              weatherData.hourly.relative_humidity_2m[weatherIndex] || 50,
            windSpeed: weatherData.hourly.wind_speed_10m[weatherIndex] || 5,
            windDirection:
              weatherData.hourly.wind_direction_10m[weatherIndex] || 0,
            pressure: weatherData.hourly.pressure_msl[weatherIndex] || 1013,
            precipitation: weatherData.hourly.precipitation[weatherIndex] || 0,
            cloudCover: weatherData.hourly.cloud_cover[weatherIndex] || 50,
            uvIndex: airQualityData.hourly.uv_index[i] || 0,
          },
          healthRecommendations: this.generateHealthRecommendations(
            pm25,
            pm10,
            o3,
            no2
          ),
        };

        forecast.push(forecastPoint);
      }

      return forecast;
    } catch (error) {
      console.error("Enhanced forecast generation error:", error);
      return this.generateMockForecast(days * 24);
    }
  }

  async getAirQualityTrends(lat: number, lon: number, days = 30): Promise<any> {
    try {
      const endDate = new Date();
      const startDate = new Date(
        endDate.getTime() - days * 24 * 60 * 60 * 1000
      );

      const historicalData = await openMeteoClient.getHistoricalData(
        lat,
        lon,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
        [
          "temperature_2m",
          "relative_humidity_2m",
          "precipitation",
          "wind_speed_10m",
          "pressure_msl",
        ]
      );

      // Get current air quality for comparison
      const currentAirQuality = await openMeteoClient.getAirQuality(lat, lon, {
        days: 1,
      });

      return {
        historical: historicalData,
        current: currentAirQuality,
        trends: this.analyzeTrends(historicalData, currentAirQuality),
      };
    } catch (error) {
      console.error("Trend analysis error:", error);
      return null;
    }
  }

  private analyzeTrends(historical: any, current: any): any {
    if (!historical || !current) return null;

    // Simple trend analysis
    const recentTemp =
      historical.hourly.temperature_2m
        .slice(-24)
        .reduce((a: number, b: number) => a + b, 0) / 24;
    const recentHumidity =
      historical.hourly.relative_humidity_2m
        .slice(-24)
        .reduce((a: number, b: number) => a + b, 0) / 24;
    const recentWind =
      historical.hourly.wind_speed_10m
        .slice(-24)
        .reduce((a: number, b: number) => a + b, 0) / 24;

    return {
      temperature: {
        recent: recentTemp,
        trend: recentTemp > 25 ? "increasing" : "stable",
        impact: recentTemp > 30 ? "high_pollution_risk" : "moderate_risk",
      },
      humidity: {
        recent: recentHumidity,
        trend: recentHumidity > 70 ? "high" : "normal",
        impact:
          recentHumidity > 80 ? "pollution_accumulation" : "normal_dispersion",
      },
      wind: {
        recent: recentWind,
        trend: recentWind < 2 ? "low" : "normal",
        impact: recentWind < 2 ? "poor_dispersion" : "good_dispersion",
      },
    };
  }

  private calculateConfidence(hourIndex: number, totalDays: number): number {
    // Confidence decreases with time
    const maxHours = totalDays * 24;
    const timeDecay = Math.max(0.4, 1 - (hourIndex / maxHours) * 0.6);

    // Higher confidence for shorter forecasts
    const baseConfidence = totalDays <= 3 ? 0.9 : totalDays <= 5 ? 0.8 : 0.7;

    return Math.round(timeDecay * baseConfidence * 100);
  }

  private generateHealthRecommendations(
    pm25: number,
    pm10: number,
    o3: number,
    no2: number
  ): string[] {
    const recommendations: string[] = [];

    // PM2.5 recommendations
    if (pm25 > 150) {
      recommendations.push("🚨 Avoid all outdoor activities");
      recommendations.push("😷 Wear N95 masks indoors if needed");
      recommendations.push("🏠 Keep windows closed, use air purifiers");
    } else if (pm25 > 100) {
      recommendations.push("⚠️ Limit outdoor activities");
      recommendations.push("😷 Wear masks when going outside");
      recommendations.push("🚶‍♀️ Avoid strenuous outdoor exercise");
    } else if (pm25 > 50) {
      recommendations.push("👥 Sensitive groups should limit outdoor time");
      recommendations.push("🏃‍♂️ Reduce intensity of outdoor exercise");
    } else {
      recommendations.push(
        "✅ Air quality is acceptable for outdoor activities"
      );
    }

    // Ozone recommendations
    if (o3 > 200) {
      recommendations.push("☀️ Avoid outdoor activities during peak sun hours");
    }

    // General recommendations
    if (pm25 > 75 || pm10 > 150) {
      recommendations.push("🌱 Consider indoor plants for air purification");
      recommendations.push("💧 Stay hydrated");
      recommendations.push("🏥 Consult doctor if experiencing symptoms");
    }

    return recommendations;
  }

  private generateMockForecast(hours: number): EnhancedForecastPoint[] {
    const forecast: EnhancedForecastPoint[] = [];
    const now = Date.now();

    for (let i = 0; i < hours; i++) {
      const pm25 = 30 + Math.random() * 120; // 30-150 range

      forecast.push({
        timestamp: now + i * 60 * 60 * 1000,
        pm25,
        pm10: pm25 * 1.5,
        co: 200 + Math.random() * 800,
        no2: 10 + Math.random() * 90,
        so2: 5 + Math.random() * 45,
        o3: 50 + Math.random() * 150,
        aqi: {
          aqi: openMeteoClient.calculateAQI(pm25).aqi,
          category: openMeteoClient.calculateAQI(pm25).category,
          color: openMeteoClient.calculateAQI(pm25).color,
        },
        confidence: Math.max(40, 95 - i),
        weatherFactors: {
          temperature: 15 + Math.random() * 20,
          humidity: 30 + Math.random() * 50,
          windSpeed: 1 + Math.random() * 15,
          windDirection: Math.random() * 360,
          pressure: 1000 + Math.random() * 30,
          precipitation: Math.random() * 5,
          cloudCover: Math.random() * 100,
          uvIndex: Math.random() * 11,
        },
        healthRecommendations: this.generateHealthRecommendations(
          pm25,
          pm25 * 1.5,
          100,
          50
        ),
      });
    }

    return forecast;
  }
}

export const enhancedPredictor = new EnhancedPollutionPredictor();
