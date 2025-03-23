
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface CloudProvider {
  id: string;
  name: string;
  color: string;
}

interface SpinWheelProps {
  providers: CloudProvider[];
  onSpinEnd: (provider: CloudProvider) => void;
  className?: string;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ providers, onSpinEnd, className }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const sectionAngle = 360 / providers.length;
  
  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedProvider(null);
    
    // Generate random number of full rotations (3-5) plus a random angle
    const fullRotations = Math.floor(Math.random() * 3) + 3;
    const randomAngle = Math.floor(Math.random() * 360);
    const totalAngle = fullRotations * 360 + randomAngle;
    
    // Calculate which provider will be selected
    const normalizedAngle = randomAngle % 360;
    const sectionIndex = Math.floor((360 - normalizedAngle) / sectionAngle) % providers.length;
    const selectedProvider = providers[sectionIndex];
    
    // Set spin animation
    if (wheelRef.current) {
      wheelRef.current.style.setProperty('--spin-angle', `${totalAngle}deg`);
      wheelRef.current.style.setProperty('--spin-duration', `${3 + Math.random() * 2}s`);
      wheelRef.current.classList.remove('animate-spin-wheel');
      // Force a reflow
      void wheelRef.current.offsetWidth;
      wheelRef.current.classList.add('animate-spin-wheel');
    }
    
    // Wait for animation to finish
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedProvider(selectedProvider);
      onSpinEnd(selectedProvider);
    }, 5000); // Match with the CSS animation duration
  };
  
  return (
    <div className={cn("relative mx-auto", className)}>
      {/* Indicator */}
      <div className="indicator animate-pulse-subtle"></div>
      
      {/* Wheel */}
      <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white shadow-xl">
        <div 
          ref={wheelRef}
          className={cn(
            "w-full h-full rounded-full relative",
            isSpinning ? "animate-spin-wheel" : "transition-all duration-300"
          )}
        >
          {providers.map((provider, index) => (
            <div 
              key={provider.id}
              className="wheel-section"
              style={{
                backgroundColor: provider.color,
                transform: `rotate(${index * sectionAngle}deg)`,
              }}
            >
              <div 
                className="cloud-provider-text"
                style={{ transform: `translateX(-50%) rotate(${90 - (index * sectionAngle) - (sectionAngle/2)}deg)` }}
              >
                {provider.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Spin button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className={cn(
            "button-shine relative px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium",
            "shadow-md transition-all duration-300 transform",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
            isSpinning 
              ? "opacity-70 cursor-not-allowed"
              : "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
            "animate-fade-in"
          )}
        >
          {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>
      </div>
    </div>
  );
};

export default SpinWheel;
