import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const AnimatedWaveBackground = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative w-full h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-900", className)}>
      <InfiniteMovingLine />
       </div>
  );
};


interface LineProps {
  delay?: number;
  duration?: number;
  opacity?: number;
  color?: string;
  position?: string;
}

const InfiniteMovingLine: React.FC<{className?: string}> = ({className  }) => {
  const backgroundLines: number[] = Array.from({ length: 8 }, (_, i) => i);
  const glowingOrbs: number[] = Array.from({ length: 5 }, (_, i) => i);

  const MovingLine: React.FC<LineProps> = ({ 
    duration = 3, 
    opacity = 1, 
    color = 'white', 
    position = '50%',
    delay = 0
  }) => (
    <div className="absolute left-0 w-full h-1 overflow-hidden transform rotate-45" style={{ top: position }}>
      <div 
        className={`h-full bg-gradient-to-r from-transparent via-${color} to-transparent`}
        style={{
          width: '300%',
          opacity,
          animation: `moveInfinite ${duration}s linear infinite`,
          animationDelay: `${delay}s`
        }}
      />
    </div>
  );

  return (
    <div className={`w-full h-screen overflow-hidden relative bg-black ${className}`}>
      {/* Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%)'
        }}
      />
      
      {/* Diagonal Background Lines - 45 degrees */}
      <div className="absolute inset-0 opacity-10">
        {backgroundLines.map((i: number) => (
          <div
            key={`bg-line-${i}`}
            className="absolute h-1 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-45"
            style={{
              width: '200%',
              top: `${i * 12}%`,
              left: '-50%',
              animation: `backgroundMove ${8 + i * 0.5}s linear infinite`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>
      
      {/* Main Moving Lines at 45 degrees - only bottom to top */}


      
      {/* Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {glowingOrbs.map((i: number) => (
          <div
            key={`orb-${i}`}
            className="absolute w-3 h-3 bg-cyan-400 rounded-full"
            style={{
              left: `${15 + i * 18}%`,
              top: `${25 + i * 12}%`,
              boxShadow: '0 0 30px rgba(56, 189, 248, 1), 0 0 60px rgba(56, 189, 248, 0.5)',
              animation: `orbPulse ${2 + i * 0.4}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes moveInfinite {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(33.33%);
          }
        }
        
        @keyframes backgroundMove {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) rotate(45deg);
          }
        }
        

        
        @keyframes orbPulse {
          0% {
            opacity: 0.6;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1.4);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedWaveBackground;