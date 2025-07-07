
import { Eye, Tint, Wind, Thermometer, Sun } from 'lucide-react';

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

  const detailItems = [
    { icon: Eye, label: 'Feels like', value: `${Math.round(feelsLike)}°${unit}` },
    { icon: Tint, label: 'Humidity', value: `${data.current.humidity}%` },
    { icon: Wind, label: 'Wind Speed', value: `${data.current.wind_kph} km/h` },
    { icon: Thermometer, label: 'Pressure', value: `${data.current.pressure_mb} mb` },
    { icon: Sun, label: 'UV Index', value: data.current.uv.toString() },
    { icon: Eye, label: 'Visibility', value: `${data.current.vis_km} km` },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 animate-fade-in-scale">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8">
        <div className="mb-6 lg:mb-0">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2 animate-glow">
            {data.location.name}
          </h2>
          <p className="text-white/80 text-lg mb-2">{data.location.country}</p>
          <p className="text-white/70 animate-pulse-soft">
            {formatTime(data.location.localtime)}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <img
            src={`https:${data.current.condition.icon}`}
            alt={data.current.condition.text}
            className="w-24 h-24 lg:w-32 lg:h-32 animate-bounce filter drop-shadow-lg"
          />
          <div className="flex items-center gap-4">
            <span className="text-6xl lg:text-7xl font-bold text-white animate-pulse">
              {Math.round(temp)}°
            </span>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onUnitChange('C')}
                className={`px-3 py-2 rounded-lg border-2 transition-all duration-300 ${
                  unit === 'C'
                    ? 'bg-white/30 border-white/60 text-white'
                    : 'bg-white/10 border-white/30 text-white/70 hover:bg-white/20'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => onUnitChange('F')}
                className={`px-3 py-2 rounded-lg border-2 transition-all duration-300 ${
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

      {/* Description */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-white mb-2 capitalize">
          {data.current.condition.text}
        </h3>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {detailItems.map((item, index) => (
          <div
            key={item.label}
            className="flex items-center gap-4 p-5 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 animate-slide-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <item.icon className="w-6 h-6 text-blue-300 filter drop-shadow-sm" />
            <div className="flex-1">
              <span className="text-white/90 font-medium">{item.label}</span>
            </div>
            <span className="text-white font-bold text-lg">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { CurrentWeather };
