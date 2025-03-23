
import React, { useState } from 'react';
import SpinWheel, { CloudProvider } from '@/components/SpinWheel';
import CloudProviderResult from '@/components/CloudProviderResult';
import ProjectTracker from '@/components/ProjectTracker';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CLOUD_PROVIDERS: CloudProvider[] = [
  { id: 'aws', name: 'AWS', color: '#FF9900' },
  { id: 'gcp', name: 'GCP', color: '#4285F4' },
  { id: 'azure', name: 'Azure', color: '#0078D4' },
  { id: 'oracle', name: 'Oracle', color: '#F80000' },
];

const Index = () => {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>(CLOUD_PROVIDERS[0]); // Default to the first provider
  const [showResult, setShowResult] = useState(true); // Always show result from the beginning
  const [activeTab, setActiveTab] = useState("spin");
  
  const handleSpinEnd = (provider: CloudProvider) => {
    setSelectedProvider(provider);
    setTimeout(() => {
      setShowResult(true);
      toast.success(`You landed on ${provider.name}!`);
    }, 800);
  };
  
  const handleContinue = () => {
    setShowResult(false);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/50">
      <motion.div 
        className="container max-w-6xl mx-auto flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Spin to Cloud</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Spin the wheel to randomly select your cloud provider for your next project.
          </p>
        </motion.div>
        
        <Tabs 
          defaultValue="spin" 
          className="w-full" 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="spin">Spin &amp; Selection</TabsTrigger>
            <TabsTrigger value="tracker">Project Tracker</TabsTrigger>
          </TabsList>
          
          <TabsContent value="spin">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Spin Wheel Side */}
              <div className="flex flex-col items-center justify-center">
                <motion.div 
                  variants={itemVariants} 
                  className="flex justify-center w-full"
                >
                  <SpinWheel 
                    providers={CLOUD_PROVIDERS} 
                    onSpinEnd={handleSpinEnd} 
                  />
                </motion.div>
              </div>
              
              {/* Project Selection Side */}
              <div className="flex flex-col items-center justify-center">
                {showResult ? (
                  <CloudProviderResult 
                    provider={selectedProvider} 
                    onContinue={handleContinue} 
                  />
                ) : (
                  <motion.div 
                    variants={itemVariants}
                    className="glass-panel rounded-xl p-8 h-full flex flex-col items-center justify-center text-center"
                  >
                    <h2 className="text-2xl font-semibold mb-4">Project Selection</h2>
                    <p className="text-muted-foreground mb-8">
                      Spin the wheel on the left to select a cloud provider and get a recommended project.
                    </p>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="text-5xl font-bold text-primary/30"
                    >
                      ?
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tracker">
            <ProjectTracker providers={CLOUD_PROVIDERS} />
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <motion.footer 
        className="mt-auto pt-8 pb-4 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        Designed with simplicity and elegance in mind.
      </motion.footer>
    </div>
  );
};

export default Index;
