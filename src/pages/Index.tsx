
import React, { useState, useEffect } from 'react';
import SpinWheel, { CloudProvider } from '@/components/SpinWheel';
import CloudProviderResult from '@/components/CloudProviderResult';
import ProjectTracker from '@/components/ProjectTracker';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCloudProviders } from '@/services/cloudProviderService';
import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';

// Default cloud providers as fallback
const DEFAULT_PROVIDERS: CloudProvider[] = [
  { id: 'aws', name: 'AWS', color: '#FF9900' },
  { id: 'gcp', name: 'GCP', color: '#4285F4' },
  { id: 'azure', name: 'Azure', color: '#0078D4' },
  { id: 'oracle', name: 'Oracle', color: '#F80000' },
];

const Index = () => {
  const { data: cloudProviders, isLoading, error } = useQuery({
    queryKey: ['cloudProviders'],
    queryFn: fetchCloudProviders,
  });
  
  const providers = cloudProviders || DEFAULT_PROVIDERS;
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("provider");
  
  // Update selectedProvider when providers are loaded
  useEffect(() => {
    if (cloudProviders && cloudProviders.length > 0 && !selectedProvider) {
      setSelectedProvider(cloudProviders[0]);
    }
  }, [cloudProviders, selectedProvider]);
  
  const handleSpinEnd = (provider: CloudProvider) => {
    setSelectedProvider(provider);
    toast.success(`You landed on ${provider.name}!`);
    // Automatically switch to project tab after selecting provider
    setTimeout(() => {
      setActiveTab("project");
    }, 1500);
  };
  
  const handleProjectSelect = (projectName: string) => {
    setSelectedProject(projectName);
    toast.success(`Project selected: ${projectName}`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load cloud providers. Using default providers.");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/50">
      <motion.div 
        className="container max-w-6xl mx-auto flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-4">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Spin to Cloud</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Spin the wheel to randomly select your cloud provider for your next project.
          </p>
        </motion.div>
        
        {/* Outcome display at the top */}
        {selectedProvider && selectedProject && (
          <motion.div 
            variants={itemVariants} 
            className="glass-panel rounded-xl p-4 mb-6 text-center w-full max-w-xl"
            style={{ backgroundColor: `${selectedProvider.color}20` }}
          >
            <h2 className="text-xl font-medium mb-2">Your Selection</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5" style={{ color: selectedProvider.color }} />
              <span className="text-2xl font-bold" style={{ color: selectedProvider.color }}>
                {selectedProvider.name}
              </span>
              <Sparkles className="h-5 w-5" style={{ color: selectedProvider.color }} />
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-medium">Project: {selectedProject}</span>
            </div>
          </motion.div>
        )}
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="provider">Cloud Provider</TabsTrigger>
            <TabsTrigger value="project">Project Selection</TabsTrigger>
            <TabsTrigger value="tracker">Project Tracker</TabsTrigger>
          </TabsList>
          
          <TabsContent value="provider">
            <div className="w-full flex flex-col items-center justify-center">
              <motion.div 
                variants={itemVariants} 
                className="flex justify-center w-full max-w-lg"
              >
                <SpinWheel 
                  providers={providers} 
                  onSpinEnd={handleSpinEnd} 
                />
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="project">
            <div className="w-full flex flex-col items-center justify-center">
              <CloudProviderResult 
                provider={selectedProvider || providers[0]}
                onProjectSelect={handleProjectSelect}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="tracker">
            <ProjectTracker providers={providers} />
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
