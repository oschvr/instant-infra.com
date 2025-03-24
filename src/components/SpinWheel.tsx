
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Wheel } from "react-custom-roulette";
import { CloudProvider } from '@/types/cloudProvider';


interface SpinWheelProps {
  providers: CloudProvider[];
  onSpinEnd: (provider: CloudProvider) => void;
  className?: string;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ providers, onSpinEnd, className }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const providerOptions = providers.map(provider => Object.assign({option: provider.name}))
  const providerColors = providers.map(provider => provider.color)

  const handleSpinClick = () => {    
    const newPrizeNumber = Math.floor(Math.random() * providers.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };


  return (
    <div className={cn("relative mx-auto flex flex-col items-center", className)}>

      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={providerOptions}
        outerBorderColor={["#fff"]}
        innerBorderColor={["#fff"]}
        radiusLineColor={["#fff"]}
        radiusLineWidth={[1]}
        fontSize={32}
        textColors={["#ffffff"]}
        backgroundColors={providerColors}
        onStopSpinning={() => {
          setMustSpin(false);
          onSpinEnd(providers.find(provider => provider.name === providerOptions[prizeNumber].option)!)
        }}
      />

      
      {/* Spin button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={handleSpinClick}
          disabled={mustSpin}
          className={cn(
            "button-shine relative px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium",
            "shadow-md transition-all duration-300 transform",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
            mustSpin 
              ? "opacity-70 cursor-not-allowed"
              : "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
            "animate-fade-in"
          )}
        >
          {mustSpin ? 'Spinning...' : 'Spin the Wheel'}
        </button>
      </div>
    </div>
  );
};

export default SpinWheel;
