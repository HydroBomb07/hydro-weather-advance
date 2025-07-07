
import { useState, useEffect } from 'react';
import { Search, Cloud, Sun, Eye, Tint, Wind, Thermometer, Calendar } from 'lucide-react';
import { WeatherService } from '../services/WeatherService';
import { CurrentWeather } from '../components/CurrentWeather';
import { ForecastSection } from '../components/ForecastSection';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { toast } from 'sonner';

interface WeatherData {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    feelslike_c: number;
    feelslike_f: number;
    humidity: number;
    wind_kph: number;
    pressure_mb: number;
    uv: number;
    vis_km: number;
  };
}

interface ForecastData {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

const Index = () => {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const quickCities = ['London', 'New York', 'Tokyo', 'Paris', 'Dubai'];

  const getWeather = async (city: string) => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const { current, forecast } = await WeatherService.getWeather(city);
      setWeatherData(current);
      setForecastData(forecast);
      toast.success(`Weather data loaded for ${current.location.name}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    getWeather(cityInput);
  };

  const handleQuickCity = (city: string) => {
    setCityInput(city);
    getWeather(city);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    // Load default city on mount
    getWeather('London');
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <Cloud className="animate-pulse" />
            Weather Dashboard
          </h1>
          <p className="text-xl text-white/90 font-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Get real-time weather information for any city
          </p>
        </header>

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 animate-slide-in-up">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter city name (e.g., London, New York)"
                className="w-full px-6 py-4 pr-12 bg-white/90 border-2 border-white/30 rounded-2xl text-lg outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-6 h-6" />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-3"
            >
              <Search className="w-5 h-5" />
              Get Weather
            </button>
          </div>

          {/* Quick Cities */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <span className="text-white/90 font-medium mr-4">Quick search:</span>
            {quickCities.map((city, index) => (
              <button
                key={city}
                onClick={() => handleQuickCity(city)}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-full text-white/90 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && <LoadingSpinner />}

        {/* Error */}
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Weather Results */}
        {weatherData && !isLoading && (
          <>
            <CurrentWeather 
              data={weatherData} 
              unit={unit} 
              onUnitChange={setUnit}
            />
            
            {forecastData.length > 0 && (
              <ForecastSection data={forecastData} unit={unit} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
