import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudProvider } from '@/types/cloudProvider';
import { Deployment } from '@/types/deployment';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface DeploymentsProps {
  provider: CloudProvider;
  deployments: Deployment[];
  onProjectSelect: (projectName: string) => void;
  onClickContinue: (tab: string) => void;
}

const Deployments: React.FC<DeploymentsProps> = ({ provider, deployments, onProjectSelect, onClickContinue }) => {
  const [selectedProject, setSelectedProject] = useState<Deployment | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(150); // Start with normal speed
  
  const startProjectSelection = () => {
    setIsSelecting(true);
    setSelectedProject(null);
  };
  
  useEffect(() => {
    // Only run the selection animation if we're in the selecting state
    if (!isSelecting) return;
    
    // Set a random time between 3-6 seconds when the selection will stop
    const stopTime = Math.floor(Math.random() * 3000) + 3000;
    const stopTimer = setTimeout(() => {
      // Slow down the animation before stopping
      setSpeed(300); // Slower speed
      
      // Finally stop after the slowdown
      const finalStopTimer = setTimeout(() => {
        setIsSelecting(false);
        // Pick a random project for the final selection
        const finalProject = deployments[Math.floor(Math.random() * deployments.length)];
        setSelectedProject(finalProject);
        onProjectSelect(finalProject.name);
      }, 1500); // Run the slowed animation for 1.5 seconds before stopping
      
      return () => clearTimeout(finalStopTimer);
    }, stopTime);
    
    return () => clearTimeout(stopTimer);
  }, [isSelecting, onProjectSelect]);
  
  useEffect(() => {
    if (!isSelecting) return;
    
    // Iterate through all projects until stopped
    const interval = setInterval(() => {
      // Cycle through projects in order
      setCurrentIndex(prevIndex => (prevIndex + 1) % deployments.length);
      setSelectedProject(deployments[currentIndex]);
    }, speed); // Speed will change based on the slowdown effect
    
    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, isSelecting, speed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-panel rounded-xl p-6 w-full max-w-lg"
    >
      
      <div 
        className="mb-6 py-6 px-4 rounded-lg flex flex-col items-center justify-center gap-3"
      >        
        <div className="w-full">
          
          {isSelecting ? (
            <div className="mb-4">
              <ul className="space-y-1">
                {deployments.map((project, idx) => (
                  <motion.li 
                    key={project.name} 
                    className={cn(
                      "py-1.5 px-3 rounded-md transition-colors",
                      idx === currentIndex ? "bg-primary/10 font-medium" : ""
                    )}
                    animate={idx === currentIndex ? { 
                      scale: 1.1,
                      backgroundColor: `${provider.color}20`
                    } : { scale: 1 }}
                  >
                    {project.name}
                  </motion.li>
                ))}
              </ul>
            </div>
          ) : selectedProject ? (
            <div className="h-14 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedProject.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="rounded-xl p-2 mb-4 text-center w-full max-w-xl"
                >
                  
                  ⚡️ <h2 className="text-xl font-medium mb-2">  You're doing a <span className="text-2xl font-bold" style={{ color: provider.color }}>
                {selectedProject.name}
              </span> in <span className="text-2xl font-bold" style={{ color: provider.color }}>
                {provider.name} 
              </span></h2> ⚡️
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="mb-4">
              
              <ul className="space-y-1">
                {deployments.map((project) => (
                  <li 
                    key={project.name} 
                    className="py-1.5 px-3 rounded-md transition-colors opacity-70"
                  >
                    {project.name} 
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
        {!selectedProject && <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startProjectSelection}
        disabled={isSelecting}
        className={cn(
          "button-shine relative px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium",
          "shadow-md transition-all duration-300 transform",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
          isSelecting 
            ? "opacity-70 cursor-not-allowed"
            : "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
          "animate-fade-in w-full"
        )}
      >
        Find Me a Project
      </motion.button>}
      {!isSelecting && selectedProject && <motion.button whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        
        disabled={isSelecting}
        className={cn(
          "button-shine relative px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium",
          "shadow-md transition-all duration-300 transform",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
          isSelecting 
            ? "opacity-70 cursor-not-allowed"
            : "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
          "animate-fade-in w-full"
        )} onClick={() => onClickContinue("tracker")}>
        Continue
        </motion.button>}
    </motion.div>
  );
};

export default Deployments;
