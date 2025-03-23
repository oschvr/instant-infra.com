
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudProvider } from './SpinWheel';
import { cn } from '@/lib/utils';
import { CloudProject, getRandomProject, CLOUD_PROJECTS } from '@/utils/projectData';
import { Sparkles } from 'lucide-react';

interface CloudProviderResultProps {
  provider: CloudProvider;
  onContinue: () => void;
}

const CloudProviderResult: React.FC<CloudProviderResultProps> = ({ provider, onContinue }) => {
  const [selectedProject, setSelectedProject] = useState<CloudProject | null>(null);
  const [isSelecting, setIsSelecting] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stopSelection, setStopSelection] = useState(false);
  
  useEffect(() => {
    if (stopSelection) {
      setIsSelecting(false);
      const finalProject = getRandomProject();
      setSelectedProject(finalProject);
      return;
    }
    
    // Iterate through all projects indefinitely until stopped
    const interval = setInterval(() => {
      // Cycle through projects in order
      setCurrentIndex(prevIndex => (prevIndex + 1) % CLOUD_PROJECTS.length);
      setSelectedProject(CLOUD_PROJECTS[currentIndex]);
    }, 150); // Slower speed for better visibility
    
    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, stopSelection]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-panel rounded-xl p-6 w-full h-full"
    >
      <h2 className="text-2xl font-medium mb-2">Your Cloud Provider</h2>
      
      <div 
        className="mt-4 mb-6 py-6 px-4 rounded-lg flex flex-col items-center justify-center gap-3"
        style={{ backgroundColor: `${provider.color}20` }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 15,
            delay: 0.2
          }}
          className="text-4xl font-bold"
          style={{ color: provider.color }}
        >
          {provider.name}
        </motion.div>
        
        <div className="mt-2 w-full">
          <h3 className="text-lg font-medium mb-2">Recommended Project</h3>
          
          {isSelecting ? (
            <>
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
              <motion.button
                onClick={() => setStopSelection(true)}
                className={cn(
                  "px-4 py-2 rounded-md text-white font-medium w-full",
                  "shadow-md transition-all duration-300 transform",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                )}
                style={{ backgroundColor: provider.color }}
              >
                Stop Selection
              </motion.button>
            </>
          ) : (
            <div className="h-14 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {selectedProject && (
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
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onContinue}
        className={cn(
          "button-shine relative px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium",
          "shadow-md transition-all duration-300 transform",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
          "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 w-full"
        )}
      >
        Try Again
      </motion.button>
    </motion.div>
  );
};

export default CloudProviderResult;
