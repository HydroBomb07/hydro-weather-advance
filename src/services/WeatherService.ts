
const API_KEY = '9c5e27c2b7bb4738b1c152306241207'; // Demo API key for WeatherAPI
const BASE_URL = 'https://api.weatherapi.com/v1';

export class WeatherService {
  static async getWeather(city: string) {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=6&aqi=no&alerts=no`
      );
      
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('City not found. Please check the spelling and try again.');
        }
        throw new Error('Weather service is currently unavailable. Please try again later.');
      }
      
      const data = await response.json();
      
      return {
        current: data,
        forecast: data.forecast.forecastday.slice(1) // Skip today, get next 5 days
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch weather data. Please check your internet connection.');
    }
  }
}
