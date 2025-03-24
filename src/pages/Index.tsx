
import React, { useState, useEffect } from 'react';
import SpinWheel, { CloudProvider } from '@/components/SpinWheel';
import CloudProviderResult from '@/components/Deployments';
import ProjectTracker from '@/components/ProjectTracker';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCloudProviders } from '@/services/cloudProviderService';
import { useQuery } from '@tanstack/react-query';
import {  } from 'lucide-react';
import { fetchDeployments } from '@/services/deploymentsService';



const Index = () => {
  const { data: cloudProviders, isLoading, error } = useQuery({
    queryKey: ['cloudProviders'],
    queryFn: fetchCloudProviders,
  });

  const { data: deployments, } = useQuery({
    queryKey: ['deployments'],
    queryFn: fetchDeployments,
  });
  
  const providers = cloudProviders;
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
    
    
    setTimeout(() => {
      setActiveTab("project");
    }, 3000);
  };
  
  const handleProjectSelect = (projectName: string) => {
    setSelectedProject(projectName);
  };

  const handleContinue = (tab: string) => {
    setActiveTab(tab)
  }
  
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
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Instant Infra ⚡️</h1>
          <p className="text-muted-foreground max-w-lg py-4 mb-3">
           Rules of the game:
          <ul className="text-left list-disc pl-6 space-y-2">
            <li>1. Spin the wheel to select a cloud provider</li>
            <li>2. Choose a genering deployment</li>
            <li>3. Record yourself doing it</li>
            <li>4. Save progress in the progress tracker</li>
          </ul>
          </p>
        </motion.div>
        
        
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
                deployments={deployments}
                onProjectSelect={handleProjectSelect}
                onClickContinue={handleContinue}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="tracker">
            <ProjectTracker providers={providers} deployments={deployments} />
          </TabsContent>
        </Tabs>
      </motion.div>
      
    </div>
  );
};

export default Index;
