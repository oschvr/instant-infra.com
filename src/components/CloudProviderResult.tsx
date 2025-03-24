
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudProvider } from './SpinWheel';
import { cn } from '@/lib/utils';
import { CloudProject, getRandomProject, CLOUD_PROJECTS } from '@/utils/projectData';
import { Sparkles } from 'lucide-react';

interface CloudProviderResultProps {
  provider: CloudProvider;
  onProjectSelect: (projectName: string) => void;
}

const CloudProviderResult: React.FC<CloudProviderResultProps> = ({ provider, onProjectSelect }) => {
  const [selectedProject, setSelectedProject] = useState<CloudProject | null>(null);
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
        const finalProject = getRandomProject();
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
      setCurrentIndex(prevIndex => (prevIndex + 1) % CLOUD_PROJECTS.length);
      setSelectedProject(CLOUD_PROJECTS[currentIndex]);
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
      <h2 className="text-2xl font-medium mb-6 text-center">Select a Project</h2>
      
      <div 
        className="mb-6 py-6 px-4 rounded-lg flex flex-col items-center justify-center gap-3"
        style={{ backgroundColor: `${provider.color}20` }}
      >        
        <div className="w-full">
          <h3 className="text-lg font-medium mb-4 text-center">Recommended Project</h3>
          
          {isSelecting ? (
            <div className="mb-4">
              <ul className="space-y-1">
                {CLOUD_PROJECTS.map((project, idx) => (
                  <motion.li 
                    key={project.id} 
                    className={cn(
                      "py-1.5 px-3 rounded-md transition-colors",
                      idx === currentIndex ? "bg-primary/10 font-medium" : ""
                    )}
                    animate={idx === currentIndex ? { 
                      scale: 1.05,
                      backgroundColor: `${provider.color}20`
                    } : { scale: 1 }}
                  >
                    {idx === currentIndex && (
                      <Sparkles className="h-4 w-4 inline mr-1" style={{ color: provider.color }} />
                    )}
                    {project.name}
                  </motion.li>
                ))}
              </ul>
            </div>
          ) : selectedProject ? (
            <div className="h-14 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-xl font-bold flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5" style={{ color: provider.color }} />
                  {selectedProject.name}
                  <Sparkles className="h-5 w-5" style={{ color: provider.color }} />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-center mb-2">Click the button below to get a recommended project</p>
              <ul className="space-y-1">
                {CLOUD_PROJECTS.map((project) => (
                  <li 
                    key={project.id} 
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
      
      <motion.button
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
        {isSelecting ? 'Selecting...' : selectedProject ? 'Select Another Project' : 'Find Me a Project'}
      </motion.button>
    </motion.div>
  );
};

export default CloudProviderResult;
