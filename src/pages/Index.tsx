
import React, { useState } from 'react';
import SpinWheel, { CloudProvider } from '@/components/SpinWheel';
import CloudProviderResult from '@/components/CloudProviderResult';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const CLOUD_PROVIDERS: CloudProvider[] = [
  { id: 'aws', name: 'AWS', color: '#FF9900' },
  { id: 'gcp', name: 'GCP', color: '#4285F4' },
  { id: 'azure', name: 'Azure', color: '#0078D4' },
  { id: 'oracle', name: 'Oracle', color: '#F80000' },
];

const Index = () => {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const handleSpinEnd = (provider: CloudProvider) => {
    setSelectedProvider(provider);
    setTimeout(() => {
      setShowResult(true);
      toast.success(`You landed on ${provider.name}!`);
    }, 800);
  };
  
  const handleContinue = () => {
    setShowResult(false);
    setSelectedProvider(null);
    toast.info('Starting a new spin!');
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
        className="container max-w-4xl mx-auto flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {!showResult ? (
          <>
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-3 tracking-tight">Spin to Cloud</h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Spin the wheel to randomly select your cloud provider for your next project.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex justify-center w-full">
              <SpinWheel 
                providers={CLOUD_PROVIDERS} 
                onSpinEnd={handleSpinEnd} 
                className="mb-10"
              />
            </motion.div>
          </>
        ) : (
          selectedProvider && (
            <CloudProviderResult 
              provider={selectedProvider} 
              onContinue={handleContinue} 
            />
          )
        )}
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
