
import { Calendar } from 'lucide-react';

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

interface Props {
  data: ForecastData[];
  unit: 'C' | 'F';
}

const ForecastSection = ({ data, unit }: Props) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 animate-slide-in-up">
      <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <Calendar className="w-8 h-8" />
        5-Day Forecast
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {data.map((forecast, index) => {
          const maxTemp = unit === 'C' ? forecast.day.maxtemp_c : forecast.day.maxtemp_f;
          const minTemp = unit === 'C' ? forecast.day.mintemp_c : forecast.day.mintemp_f;
          
          return (
            <div
              key={forecast.date}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fade-in-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-white font-bold text-lg mb-2">
                {formatDate(forecast.date)}
              </div>
              <div className="text-white/70 text-sm mb-4">
                {formatShortDate(forecast.date)}
              </div>
              
              <img
                src={`https:${forecast.day.condition.icon}`}
                alt={forecast.day.condition.text}
                className="w-16 h-16 mx-auto mb-4 filter drop-shadow-lg hover:scale-110 transition-transform duration-300"
              />
              
              <div className="flex justify-between items-center mb-3 text-lg">
                <span className="text-yellow-300 font-bold">
                  {Math.round(maxTemp)}°{unit}
                </span>
                <span className="text-white/70">
                  {Math.round(minTemp)}°{unit}
                </span>
              </div>
              
              <p className="text-white/80 text-sm capitalize leading-tight">
                {forecast.day.condition.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { ForecastSection };
