
import { useEffect, useState } from 'react';

const AnimatedCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    let trailId = 0;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add trail point
      setTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: trailId++ }];
        return newTrail.slice(-8); // Keep only last 8 trail points
      });
    };

    const handleMouseEnter = () => setCursorVariant('hover');
    const handleMouseLeave = () => setCursorVariant('default');

    document.addEventListener('mousemove', updateMousePosition);
    
    // Add event listeners for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Clean up old trail points
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.slice(1));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-50 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          style={{
            left: point.x - 4,
            top: point.y - 4,
            opacity: (index + 1) / trail.length * 0.6,
            transform: `scale(${(index + 1) / trail.length})`,
            transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
          }}
        />
      ))}
      
      {/* Main cursor */}
      <div
        className={`fixed pointer-events-none z-50 mix-blend-difference transition-all duration-200 ease-out ${
          cursorVariant === 'hover' 
            ? 'w-8 h-8 bg-white rounded-full' 
            : 'w-4 h-4 bg-white rounded-full'
        }`}
        style={{
          left: mousePosition.x - (cursorVariant === 'hover' ? 16 : 8),
          top: mousePosition.y - (cursorVariant === 'hover' ? 16 : 8),
        }}
      />
    </>
  );
};

export { AnimatedCursor };
