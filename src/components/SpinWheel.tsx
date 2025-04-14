import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Wheel } from "react-custom-roulette";
import { CloudProvider } from "@/types/cloudProvider";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";

interface SpinWheelProps {
  providers: CloudProvider[];
  onSpinEnd: (provider: CloudProvider) => void;
  className?: string;
}

const SpinWheel: React.FC<SpinWheelProps> = ({
  providers,
  onSpinEnd,
  className,
}) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const providerOptions = providers.map((provider) =>
    Object.assign({ option: provider.name })
  );
  const providerColors = providers.map((provider) => provider.color);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * providers.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div
          className={cn(
            "relative mx-auto flex flex-col items-center py-8",
            className
          )}
        >
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
              onSpinEnd(
                providers.find(
                  (provider) =>
                    provider.name === providerOptions[prizeNumber].option
                )!
              );
            }}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={mustSpin}
            onClick={handleSpinClick}
            className={cn(
              "button-shine relative px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium w-full mt-8",
              "shadow-md transition-all duration-300 transform",
              mustSpin ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"
            )}
          >
            {mustSpin ? "Spinning..." : "Spin the Wheel"}
          </motion.button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpinWheel;
