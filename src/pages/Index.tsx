import { useState, useEffect, useRef } from 'react';
import { Search, Cloud, MapPin } from 'lucide-react';
import { WeatherService } from '../services/WeatherService';
import { CurrentWeather } from '../components/CurrentWeather';
import { ForecastSection } from '../components/ForecastSection';
import { HourlyWeather } from '../components/HourlyWeather';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { AnimatedCursor } from '../components/AnimatedCursor';
import { EnhancedLoader } from '../components/EnhancedLoader';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { ErrorMessage } from '../components/ErrorMessage';
import { AnimatedText, GlowText, ShimmerText, FloatingText } from '../components/AnimatedText';
import { toast } from 'sonner';
import { WeatherBackground } from '../components/WeatherBackground';

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

interface HourlyData {
  time: string;
  temp: number;
  icon: string;
  description: string;
  humidity: number;
  windSpeed: number;
}

const Index = () => {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBtnRef = useRef<HTMLButtonElement>(null);

  const quickCities = ['Titwala', 'Nagpur', 'Tokyo', 'Paris', 'Dubai'];

  // Enhanced geolocation function
  const getUserLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          });
        });
        
        const { latitude, longitude } = position.coords;
        await getWeatherByCoords(latitude, longitude);
      } catch (error) {
        console.log('Location access denied or unavailable');
        getWeather('London'); // Fallback to London
      }
    } else {
      getWeather('London'); // Fallback if geolocation not supported
    }
  };

  const getWeatherByCoords = async (lat: number, lon: number) => {
    setIsLoading(true);
    setError('');
    
    try {
      const unitSystem = unit === 'C' ? 'metric' : 'imperial';
      const { current, forecast, hourly } = await WeatherService.getWeatherByCoords(lat, lon, unitSystem);
      
      // Staggered animation delays
      setTimeout(() => {
        setWeatherData(current);
        setCityInput(current.location.name);
      }, 300);
      
      setTimeout(() => {
        setForecastData(forecast);
      }, 600);

      setTimeout(() => {
        setHourlyData(hourly || []);
      }, 900);
      
      toast.success(`Weather loaded for your location: ${current.location.name}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeather = async (city?: string) => {
    const searchCity = city || cityInput.trim();
    
    if (!searchCity) {
      setError('Please enter a city name');
      inputRef.current?.focus();
      return;
    }

    setIsSearching(true);
    setIsLoading(true);
    setError('');
    
    try {
      const unitSystem = unit === 'C' ? 'metric' : 'imperial';
      const { current, forecast, hourly } = await WeatherService.getWeather(searchCity, unitSystem);
      
      // Staggered animation delays
      setTimeout(() => {
        setWeatherData(current);
      }, 300);
      
      setTimeout(() => {
        setForecastData(forecast);
      }, 600);

      setTimeout(() => {
        setHourlyData(hourly || []);
      }, 900);
      
      toast.success(`Weather data loaded for ${current.location.name}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    createRippleEffect();
    animateSearch();
    getWeather();
  };

  const handleQuickCity = (city: string) => {
    setCityInput(city);
    animateSearch();
    getWeather(city);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleUnitChange = (newUnit: 'C' | 'F') => {
    if (unit === newUnit) return;
    
    setUnit(newUnit);
    
    if (weatherData) {
      const city = cityInput || weatherData.location.name;
      if (city) {
        getWeather(city);
      }
    }
  };

  const animateSearch = () => {
    if (searchBtnRef.current) {
      searchBtnRef.current.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (searchBtnRef.current) {
          searchBtnRef.current.style.transform = '';
        }
      }, 150);
    }
  };

  const createRippleEffect = () => {
    if (!searchBtnRef.current) return;
    
    const button = searchBtnRef.current;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const handleInputFocus = () => {
    if (inputRef.current?.parentElement) {
      inputRef.current.parentElement.style.transform = 'scale(1.02)';
    }
  };

  const handleInputBlur = () => {
    if (inputRef.current?.parentElement) {
      inputRef.current.parentElement.style.transform = 'scale(1)';
    }
  };

  useEffect(() => {
    getUserLocation();
    
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      const particles = document.querySelectorAll('.particle');
      particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.02;
        const x = mouseX * speed * 10;
        const y = mouseY * speed * 10;
        (particle as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (weatherData && cityInput) {
      const timeoutId = setTimeout(() => {
        getWeather(cityInput);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [unit]);

  return (
    <>
      <AnimatedCursor />
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />
        <WeatherBackground 
          weatherCondition={weatherData?.current.condition.text}
          weatherIcon={weatherData?.current.condition.icon}
        />
        <DarkModeToggle />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {/* Header with enhanced animations */}
          <header className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4 animate-float">
              <Cloud className="animate-pulse" />
              <GlowText>
                <AnimatedText text="Weather Dashboard" delay={500} speed={150} />
              </GlowText>
            </h1>
            <p className="text-xl text-white/90 font-light animate-fade-in animate-pulse-soft" style={{ animationDelay: '0.2s' }}>
              <ShimmerText>
                <FloatingText>Get real-time weather information for any city</FloatingText>
              </ShimmerText>
            </p>
          </header>

          {/* Enhanced Search Section */}
          <div className="bg-white/15 dark:bg-black/20 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 dark:border-gray-600 animate-slide-in-up hover:bg-white/20 dark:hover:bg-black/25 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Enter city name (e.g., London, New York)"
                  className="w-full px-6 py-4 pr-12 bg-white/90 dark:bg-gray-800/90 border-2 border-white/30 dark:border-gray-600 rounded-2xl text-lg outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 focus:scale-105 text-gray-900 dark:text-white"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-6 h-6" />
              </div>
              <button
                ref={searchBtnRef}
                onClick={handleSearch}
                disabled={isLoading || isSearching}
                className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-3"
              >
                <Search className="w-5 h-5" />
                {isSearching ? 'Searching...' : 'Get Weather'}
              </button>
              
              <button
                onClick={getUserLocation}
                className="px-4 py-4 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-gray-600 rounded-2xl text-white hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 backdrop-blur-sm hover:-translate-y-1"
                title="Use my location"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Cities with enhanced animations */}
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <span className="text-white/90 font-medium mr-4">
                <AnimatedText text="Quick search:" delay={1000} speed={50} />
              </span>
              {quickCities.map((city, index) => (
                <button
                  key={city}
                  onClick={() => handleQuickCity(city)}
                  className="px-4 py-2 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-gray-600 rounded-full text-white/90 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 backdrop-blur-sm hover:-translate-y-1 animate-fade-in hover:animate-bounce"
                  style={{ animationDelay: `${index * 0.1 + 1.5}s` }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Loading */}
          {isLoading && <EnhancedLoader />}

          {/* Error */}
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}

          {/* Weather Results with staggered animations */}
          {weatherData && !isLoading && (
            <>
              <div className="animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
                <CurrentWeather 
                  data={weatherData} 
                  unit={unit} 
                  onUnitChange={handleUnitChange}
                />
              </div>

              {hourlyData.length > 0 && (
                <div className="animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                  <HourlyWeather data={hourlyData} unit={unit} />
                </div>
              )}
              
              {forecastData.length > 0 && (
                <div className="animate-slide-in-up" style={{ animationDelay: '0.9s' }}>
                  <ForecastSection data={forecastData} unit={unit} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
