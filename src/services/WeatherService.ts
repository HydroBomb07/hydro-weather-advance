const API_KEY = '575fcf489cce2ff7e3b873f8eca5c92c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  static async getWeather(city: string, unit: 'metric' | 'imperial' = 'metric') {
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        this.fetchWeatherByCity(city, unit),
        this.fetchForecastByCity(city, unit)
      ]);
      
      return {
        current: this.transformWeatherData(weatherResponse),
        forecast: this.transformForecastData(forecastResponse),
        hourly: this.transformHourlyData(forecastResponse)
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch weather data. Please check your internet connection.');
    }
  }

  static async getWeatherByCoords(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') {
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        this.fetchWeatherByCoords(lat, lon, unit),
        this.fetchForecastByCoords(lat, lon, unit)
      ]);
      
      return {
        current: this.transformWeatherData(weatherResponse),
        forecast: this.transformForecastData(forecastResponse),
        hourly: this.transformHourlyData(forecastResponse)
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch weather data.');
    }
  }

  private static async fetchWeatherByCity(city: string, unit: string) {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`;
    return this.fetchWeatherData(url);
  }

  private static async fetchWeatherByCoords(lat: number, lon: number, unit: string) {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
    return this.fetchWeatherData(url);
  }

  private static async fetchForecastByCity(city: string, unit: string) {
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`;
    return this.fetchForecastData(url);
  }

  private static async fetchForecastByCoords(lat: number, lon: number, unit: string) {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
    return this.fetchForecastData(url);
  }

  private static async fetchWeatherData(url: string) {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.');
      } else if (response.status === 401) {
        throw new Error('API key invalid. Please check your configuration.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else {
        throw new Error('Failed to fetch weather data. Please try again.');
      }
    }
    
    return response.json();
  }

  private static async fetchForecastData(url: string) {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    
    return response.json();
  }

  private static transformWeatherData(data: any) {
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        localtime: new Date().toISOString()
      },
      current: {
        temp_c: data.main.temp,
        temp_f: (data.main.temp * 9/5) + 32,
        condition: {
          text: data.weather[0].main,
          icon: `//openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        },
        feelslike_c: data.main.feels_like,
        feelslike_f: (data.main.feels_like * 9/5) + 32,
        humidity: data.main.humidity,
        wind_kph: data.wind.speed * 3.6,
        pressure_mb: data.main.pressure,
        uv: 0,
        vis_km: data.visibility ? data.visibility / 1000 : 10
      }
    };
  }

  private static transformForecastData(data: any) {
    const dailyData: { [key: string]: any } = {};
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: date.toISOString().split('T')[0],
          day: {
            maxtemp_c: item.main.temp_max,
            maxtemp_f: (item.main.temp_max * 9/5) + 32,
            mintemp_c: item.main.temp_min,
            mintemp_f: (item.main.temp_min * 9/5) + 32,
            condition: {
              text: item.weather[0].main,
              icon: `//openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
            }
          }
        };
      } else {
        dailyData[dateKey].day.maxtemp_c = Math.max(dailyData[dateKey].day.maxtemp_c, item.main.temp_max);
        dailyData[dateKey].day.maxtemp_f = Math.max(dailyData[dateKey].day.maxtemp_f, (item.main.temp_max * 9/5) + 32);
        dailyData[dateKey].day.mintemp_c = Math.min(dailyData[dateKey].day.mintemp_c, item.main.temp_min);
        dailyData[dateKey].day.mintemp_f = Math.min(dailyData[dateKey].day.mintemp_f, (item.main.temp_min * 9/5) + 32);
      }
    });
    
    return Object.values(dailyData).slice(0, 5);
  }

  private static transformHourlyData(data: any) {
    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    
    // Filter to get only next 24 hours from current time
    const next24Hours = data.list.filter((item: any) => {
      const itemDate = new Date(item.dt * 1000);
      const hoursDiff = (itemDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursDiff >= 0 && hoursDiff <= 24;
    }).slice(0, 24);
    
    return next24Hours.map((item: any) => {
      const date = new Date(item.dt * 1000);
      return {
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        temp: item.main.temp,
        icon: `//openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        description: item.weather[0].description,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed * 3.6
      };
    });
  }
}
