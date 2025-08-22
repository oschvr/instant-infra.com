import React, { useState } from "react";
import { motion } from "framer-motion";
import { CloudProvider } from "@/types/cloudProvider";
import { Deployment } from "@/types/deployment";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface DeploymentsProps {
  provider: CloudProvider;
  deployments: Deployment[];
  onProjectSelect: (deployment: Deployment) => void;
  onClickContinue: (tab: string) => void;
}

const Deployments: React.FC<DeploymentsProps> = ({
  provider,
  deployments,
  onProjectSelect,
  onClickContinue,
}) => {
  const [selectedProject, setSelectedProject] = useState<Deployment | null>(
    null,
  );
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startProjectSelection = () => {
    setIsSelecting(true);
    setSelectedProject(null);

    // Start the randomization animation
    const animationInterval = setInterval(() => {
      setCurrentIndex(Math.floor(Math.random() * deployments.length));
    }, 500);

    // Stop after 3 seconds with easing
    setTimeout(() => {
      clearInterval(animationInterval);
      const finalProject =
        deployments[Math.floor(Math.random() * deployments.length)];
      setSelectedProject(finalProject);
      setIsSelecting(false);
      setTimeout(() => {
        onProjectSelect(finalProject);
      }, 1000);
    }, 5000);
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div className="mb-6 py-6 px-4 rounded-lg">
          <ul className="space-y-1">
            {deployments.map((project, idx) => (
              <motion.li
                key={project.name}
                className={cn(
                  "py-1.5 px-3 rounded-md transition-colors",
                  idx === currentIndex && isSelecting
                    ? "bg-primary/30 font-medium"
                    : "",
                  project === selectedProject
                    ? "bg-primary/20 font-medium"
                    : "",
                )}
                animate={
                  (idx === currentIndex && isSelecting) ||
                  project === selectedProject
                    ? { scale: 1.05, backgroundColor: `${provider.color}20` }
                    : { scale: 1 }
                }
              >
                {project.name}
              </motion.li>
            ))}
          </ul>
        </div>

        {!selectedProject ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            <Button
              onClick={startProjectSelection}
              disabled={isSelecting}
              className={cn(
                "button-shine w-full shadow-md transition-all duration-300 transform",
                isSelecting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-lg",
              )}
              size="lg"
            >
              Find Me a Project
            </Button>
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            <Button
              onClick={() => onClickContinue("tracker")}
              className="button-shine w-full shadow-md"
              size="lg"
            >
              Continue
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default Deployments;
