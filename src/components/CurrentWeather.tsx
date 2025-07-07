
import { Eye, Droplets, Wind, Thermometer, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AnimatedText, GlowText } from './AnimatedText';

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

interface Props {
  data: WeatherData;
  unit: 'C' | 'F';
  onUnitChange: (unit: 'C' | 'F') => void;
}

const CurrentWeather = ({ data, unit, onUnitChange }: Props) => {
  const temp = unit === 'C' ? data.current.temp_c : data.current.temp_f;
  const feelsLike = unit === 'C' ? data.current.feelslike_c : data.current.feelslike_f;
  const weatherMainRef = useRef<HTMLHeadingElement>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const text = data.current.condition.text;
    let i = 0;
    setDisplayedText('');
    setShowCursor(true);
    
    const typeWriter = () => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => setShowCursor(false), 1000);
      }
    };
    
    const timeout = setTimeout(typeWriter, 500);
    return () => clearTimeout(timeout);
  }, [data.current.condition.text]);

  const detailItems = [
    { icon: Eye, label: 'Feels like', value: `${Math.round(feelsLike)}°${unit}` },
    { icon: Droplets, label: 'Humidity', value: `${data.current.humidity}%` },
    { icon: Wind, label: 'Wind Speed', value: `${Math.round(data.current.wind_kph)} km/h` },
    { icon: Thermometer, label: 'Pressure', value: `${data.current.pressure_mb} mb` },
    { icon: Sun, label: 'UV Index', value: data.current.uv > 0 ? data.current.uv.toString() : 'N/A' },
    { icon: Eye, label: 'Visibility', value: `${data.current.vis_km} km` },
  ];

  const handleUnitClick = (newUnit: 'C' | 'F') => {
    onUnitChange(newUnit);
    
    const buttons = document.querySelectorAll('.unit-btn');
    buttons.forEach(btn => {
      if (btn.textContent?.includes(newUnit)) {
        (btn as HTMLElement).style.transform = 'scale(1.2)';
        setTimeout(() => {
          (btn as HTMLElement).style.transform = '';
        }, 200);
      }
    });
  };

  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 dark:border-gray-600 animate-fade-in-scale hover:bg-white/15 dark:hover:bg-black/25 hover:-translate-y-2 transition-all duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8">
        <div className="mb-6 lg:mb-0">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2 animate-glow">
            <GlowText>
              <AnimatedText text={data.location.name} speed={100} />
            </GlowText>
          </h2>
          <p className="text-white/80 text-lg mb-2">
            <AnimatedText text={data.location.country} delay={1000} speed={50} />
          </p>
          <p className="text-white/70 animate-pulse-soft">
            {formatTime(data.location.localtime)}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <img
            src={`https:${data.current.condition.icon}`}
            alt={data.current.condition.text}
            className="w-24 h-24 lg:w-32 lg:h-32 animate-bounce filter drop-shadow-lg hover:scale-110 transition-transform duration-300 animate-weather-icon-spin"
          />
          <div className="flex items-center gap-4">
            <span className="text-6xl lg:text-7xl font-bold text-white animate-pulse animate-number-count">
              {Math.round(temp)}°
            </span>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleUnitClick('C')}
                className={`unit-btn px-3 py-2 rounded-lg border-2 transition-all duration-300 ${
                  unit === 'C'
                    ? 'bg-white/30 border-white/60 text-white'
                    : 'bg-white/10 border-white/30 text-white/70 hover:bg-white/20'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => handleUnitClick('F')}
                className={`unit-btn px-3 py-2 rounded-lg border-2 transition-all duration-300 ${
                  unit === 'F'
                    ? 'bg-white/30 border-white/60 text-white'
                    : 'bg-white/10 border-white/30 text-white/70 hover:bg-white/20'
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description with typing effect */}
      <div className="text-center mb-8">
        <h3 
          ref={weatherMainRef}
          className="text-2xl font-semibold text-white mb-2 capitalize"
          style={{
            borderRight: showCursor ? '2px solid white' : 'none',
            minHeight: '2rem'
          }}
        >
          {displayedText}
        </h3>
      </div>

      {/* Weather Details Grid with enhanced animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {detailItems.map((item, index) => (
          <div
            key={item.label}
            className="flex items-center gap-4 p-5 bg-white/10 dark:bg-black/10 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-600 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 hover:-translate-y-1 animate-slide-in-up hover:scale-105 group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <item.icon className="w-6 h-6 text-blue-300 dark:text-purple-400 filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
            <div className="flex-1">
              <span className="text-white/90 font-medium">{item.label}</span>
            </div>
            <span className="text-white font-bold text-lg animate-counter">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { CurrentWeather };
