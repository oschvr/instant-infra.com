
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
  
  useEffect(() => {
    // Iterate through all projects before selecting one
    const projectsCount = 15; // Reduced number of iterations to finish faster
    let counter = 0;
    
    const interval = setInterval(() => {
      if (counter < projectsCount) {
        // Cycle through projects in order
        setCurrentIndex(prevIndex => (prevIndex + 1) % CLOUD_PROJECTS.length);
        setSelectedProject(CLOUD_PROJECTS[currentIndex]);
        counter++;
      } else {
        clearInterval(interval);
        setIsSelecting(false);
        // Final selection - random
        const finalProject = getRandomProject();
        setSelectedProject(finalProject);
      }
    }, 100); // Speed increased (100ms instead of 150ms)
    
    // Maximum animation time of 10 seconds
    const maxAnimationTime = setTimeout(() => {
      clearInterval(interval);
      if (isSelecting) {
        setIsSelecting(false);
        const finalProject = getRandomProject();
        setSelectedProject(finalProject);
      }
    }, 8000); // 8 seconds as safety margin
    
    return () => {
      clearInterval(interval);
      clearTimeout(maxAnimationTime);
    };
  }, [currentIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-panel rounded-xl p-8 md:p-10 max-w-md mx-auto text-center"
    >
      <h2 className="text-2xl font-medium mb-2">Your Cloud Provider</h2>
      
      <div 
        className="mt-6 mb-8 py-10 px-8 rounded-lg flex flex-col items-center justify-center gap-5"
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
          className="text-5xl font-bold"
          style={{ color: provider.color }}
        >
          {provider.name}
        </motion.div>
        
        <div className="mt-4 w-full">
          <h3 className="text-lg font-medium mb-2">Recommended Project</h3>
          
          {isSelecting ? (
            <div className="h-40 overflow-y-auto p-2 bg-background/50 rounded-md shadow-inner mb-3">
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
          "button-shine relative px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium",
          "shadow-md transition-all duration-300 transform",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
          "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
        )}
      >
        Continue
      </motion.button>
    </motion.div>
  );
};

export default CloudProviderResult;
