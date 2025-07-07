
import { useEffect, useState } from 'react';

interface Props {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

const AnimatedText = ({ text, className = '', delay = 0, speed = 100 }: Props) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsComplete(true);
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay, speed]);

  return (
    <span className={`${className} ${isComplete ? '' : 'animate-pulse'}`}>
      {displayedText}
      {!isComplete && <span className="animate-blink text-white">|</span>}
    </span>
  );
};

const GlowText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`animate-text-glow bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

const ShimmerText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`animate-shimmer bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent bg-size-200 ${className}`}>
    {children}
  </span>
);

const FloatingText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`animate-float ${className}`}>
    {children}
  </span>
);

export { AnimatedText, GlowText, ShimmerText, FloatingText };
