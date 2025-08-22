import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Wheel } from "react-custom-roulette";
import { CloudProvider } from "@/types/cloudProvider";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

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
  const [wheelData, setWheelData] = useState<{ option: string }[]>([]);

  useEffect(() => {
    if (providers && providers.length > 0) {
      const options = providers.map((provider) => ({
        option: provider.name,
      }));
      setWheelData(options);
    }
  }, [providers]);

  const handleSpinClick = () => {
    if (!providers || providers.length === 0) return;
    const newPrizeNumber = Math.floor(Math.random() * providers.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  if (!providers || providers.length === 0) {
    return (
      <Card className="w-full">
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">No providers available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent>
        <div
          className={cn(
            "relative mx-auto flex flex-col items-center py-8",
            className,
          )}
        >
          {wheelData.length > 0 && (
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={wheelData}
              outerBorderColor="#fff"
              innerBorderColor="#fff"
              radiusLineColor="#fff"
              radiusLineWidth={1}
              fontSize={32}
              textColors={["#ffffff"]}
              backgroundColors={providers.map((p) => p.color)}
              onStopSpinning={() => {
                setMustSpin(false);
                const selectedProvider = providers[prizeNumber];
                if (selectedProvider) {
                  onSpinEnd(selectedProvider);
                }
              }}
            />
          )}

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-8"
          >
            <Button
              disabled={mustSpin || wheelData.length === 0}
              onClick={handleSpinClick}
              className={cn(
                "button-shine w-full shadow-md transition-all duration-300 transform",
                mustSpin || wheelData.length === 0
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-lg",
              )}
              size="lg"
            >
              {mustSpin ? "Spinning..." : "Spin the Wheel"}
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpinWheel;
