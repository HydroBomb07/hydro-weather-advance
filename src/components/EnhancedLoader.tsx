
const EnhancedLoader = () => {
  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="relative inline-block mb-8">
        {/* Main spinner */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-transparent border-t-white/70 border-r-purple-400 rounded-full animate-spin"></div>
          <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-b-pink-400 border-l-cyan-400 rounded-full animate-spin-reverse"></div>
          <div className="absolute inset-4 w-8 h-8 border-4 border-transparent border-t-yellow-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 w-20 h-20">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-orbit"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
        
        {/* Pulsing ring */}
        <div className="absolute inset-0 w-20 h-20 border-2 border-white/20 rounded-full animate-ping"></div>
      </div>
      
      {/* Animated text */}
      <div className="space-y-2">
        <p className="text-white text-xl font-light animate-text-shimmer bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent bg-size-200 animate-shimmer">
          Fetching weather data
        </p>
        <div className="flex justify-center items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { EnhancedLoader };
