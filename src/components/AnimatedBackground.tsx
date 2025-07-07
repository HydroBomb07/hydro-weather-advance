
import { useEffect } from 'react';

const AnimatedBackground = () => {
  useEffect(() => {
    // Create additional floating particles dynamically
    const createFloatingParticles = () => {
      const particlesContainer = document.querySelector('.particles-container');
      if (!particlesContainer) return;
      
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          const particle = document.createElement('div');
          particle.className = 'particle dynamic-particle';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
          particle.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
          particle.style.width = Math.random() * 4 + 2 + 'px';
          particle.style.height = particle.style.width;
          particlesContainer.appendChild(particle);
          
          setTimeout(() => {
            particle.remove();
          }, 25000);
        }
      }, 3000);
      
      return () => clearInterval(interval);
    };
    
    const cleanup = createFloatingParticles();
    return cleanup;
  }, []);

  return (
    <>
      {/* Enhanced Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 dark:from-gray-900 dark:via-purple-900 dark:to-black animate-gradient-shift" />
      
      {/* Floating Particles */}
      <div className="particles-container fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-white/60 dark:bg-purple-400/60 rounded-full animate-float-particles"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      
      {/* Overlay for better text contrast */}
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40" />
    </>
  );
};

export { AnimatedBackground };
