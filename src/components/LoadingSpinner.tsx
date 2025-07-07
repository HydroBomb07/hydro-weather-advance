
const LoadingSpinner = () => {
  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="relative inline-block mb-6">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        <div className="flex justify-center gap-1 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
      <p className="text-white text-lg font-light animate-pulse">
        Fetching weather data...
      </p>
    </div>
  );
};

export { LoadingSpinner };
