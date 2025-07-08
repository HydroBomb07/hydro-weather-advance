
import { useEffect, useState, useMemo } from 'react';

interface WeatherBackgroundProps {
  weatherCondition?: string;
  weatherIcon?: string;
}

const WeatherBackground = ({ weatherCondition, weatherIcon }: WeatherBackgroundProps) => {
  const [weatherType, setWeatherType] = useState<string>('clear');

  useEffect(() => {
    if (!weatherCondition && !weatherIcon) return;
    
    const condition = weatherCondition?.toLowerCase() || '';
    const icon = weatherIcon || '';
    
    // Determine weather type from condition or icon
    if (condition.includes('rain') || icon.includes('09') || icon.includes('10')) {
      setWeatherType('rain');
    } else if (condition.includes('snow') || icon.includes('13')) {
      setWeatherType('snow');
    } else if (condition.includes('cloud') || icon.includes('02') || icon.includes('03') || icon.includes('04')) {
      setWeatherType('cloudy');
    } else if (condition.includes('thunder') || icon.includes('11')) {
      setWeatherType('storm');
    } else if (condition.includes('fog') || condition.includes('mist') || icon.includes('50')) {
      setWeatherType('fog');
    } else {
      setWeatherType('clear');
    }
  }, [weatherCondition, weatherIcon]);

  // Memoize expensive calculations
  const rainDrops = useMemo(() => {
    return [...Array(50)].map((_, i) => (
      <div
        key={`rain-${i}`}
        className="absolute opacity-60 bg-blue-300 rounded-full animate-rain-fall will-change-transform"
        style={{
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 10 + 8}px`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${Math.random() * 0.5 + 0.8}s`,
          transform: `rotate(${Math.random() * 20}deg)`,
        }}
      />
    ));
  }, []);

  const snowFlakes = useMemo(() => {
    return [...Array(30)].map((_, i) => (
      <div
        key={`snow-${i}`}
        className="absolute opacity-80 bg-white rounded-full animate-snow-fall will-change-transform"
        style={{
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 6 + 3}px`,
          height: `${Math.random() * 6 + 3}px`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${Math.random() * 2 + 3}s`,
        }}
      />
    ));
  }, []);

  const lightning = useMemo(() => (
    <div className="absolute inset-0 pointer-events-none">
      <div 
        className="absolute inset-0 bg-white opacity-0 animate-lightning will-change-opacity"
        style={{
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: '0.2s',
          animationIterationCount: 'infinite'
        }}
      />
    </div>
  ), []);

  const fogEffect = useMemo(() => {
    return [...Array(3)].map((_, i) => (
      <div
        key={`fog-${i}`}
        className="absolute bg-gray-300 dark:bg-gray-600 opacity-30 rounded-full animate-fog-drift will-change-transform"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 150 + 80}px`,
          height: `${Math.random() * 80 + 40}px`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 8 + 12}s`,
          filter: 'blur(30px)',
        }}
      />
    ));
  }, []);

  const cloudyEffect = useMemo(() => {
    return [...Array(5)].map((_, i) => (
      <div
        key={`cloud-${i}`}
        className="absolute bg-white dark:bg-gray-300 opacity-20 rounded-full animate-cloud-drift will-change-transform"
        style={{
          left: `${Math.random() * 120 - 10}%`,
          top: `${Math.random() * 60}%`,
          width: `${Math.random() * 120 + 60}px`,
          height: `${Math.random() * 60 + 30}px`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${Math.random() * 15 + 25}s`,
          filter: 'blur(15px)',
        }}
      />
    ));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Weather-specific effects */}
      {weatherType === 'rain' && (
        <div className="absolute inset-0">
          {rainDrops}
        </div>
      )}
      
      {weatherType === 'snow' && (
        <div className="absolute inset-0">
          {snowFlakes}
        </div>
      )}
      
      {weatherType === 'storm' && (
        <>
          <div className="absolute inset-0">
            {rainDrops}
          </div>
          {lightning}
        </>
      )}
      
      {weatherType === 'fog' && (
        <div className="absolute inset-0">
          {fogEffect}
        </div>
      )}
      
      {weatherType === 'cloudy' && (
        <div className="absolute inset-0">
          {cloudyEffect}
        </div>
      )}
    </div>
  );
};

export { WeatherBackground };
