
interface HourlyData {
  time: string;
  temp: number;
  icon: string;
  description: string;
  humidity: number;
  windSpeed: number;
}

interface Props {
  data: HourlyData[];
  unit: 'C' | 'F';
}

const HourlyWeather = ({ data, unit }: Props) => {
  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-white/20 dark:border-gray-600 animate-slide-in-up">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 animate-text-glow">
        <span className="animate-bounce">⏰</span>
        24-Hour Forecast
      </h3>
      
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4 min-w-max">
          {data.map((hour, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-600 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 hover:-translate-y-2 animate-fade-in-scale group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center min-w-[80px]">
                <div className="text-white/90 font-medium mb-2 animate-text-slide">
                  {hour.time}
                </div>
                <img
                  src={`https:${hour.icon}`}
                  alt={hour.description}
                  className="w-12 h-12 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 animate-weather-icon-spin"
                />
                <div className="text-white font-bold text-lg mb-1 animate-number-count">
                  {Math.round(hour.temp)}°{unit}
                </div>
                <div className="text-white/70 text-xs mb-2 capitalize animate-text-fade">
                  {hour.description}
                </div>
                <div className="space-y-1">
                  <div className="text-white/60 text-xs flex items-center justify-center gap-1">
                    <span>💧</span>
                    <span className="animate-counter">{hour.humidity}%</span>
                  </div>
                  <div className="text-white/60 text-xs flex items-center justify-center gap-1">
                    <span>💨</span>
                    <span className="animate-counter">{Math.round(hour.windSpeed)} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { HourlyWeather };
