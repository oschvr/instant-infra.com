import React, { useState, useEffect } from "react";
import SpinWheel, { CloudProvider } from "@/components/SpinWheel";
import CloudProviderResult from "@/components/Deployments";
import ProjectTracker from "@/components/ProjectTracker";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCloudProviders } from "@/services/cloudProviderService";
import { useQuery } from "@tanstack/react-query";
import {} from "lucide-react";
import { fetchDeployments } from "@/services/deploymentsService";
import ReactConfetti from "react-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchChallenges } from "@/services/challengesService";

const Index = () => {
  const {
    data: cloudProviders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cloudProviders"],
    queryFn: fetchCloudProviders,
  });

  const { data: deployments } = useQuery({
    queryKey: ["deployments"],
    queryFn: fetchDeployments,
  });

  const { data: challenges } = useQuery({
    queryKey: ["challenges"],
    queryFn: fetchChallenges,
  });

  const providers = cloudProviders;
  const [selectedProvider, setSelectedProvider] =
    useState<CloudProvider | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("provider");
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showProjectResult, setShowProjectResult] = useState(false);
  const [showProjectConfetti, setShowProjectConfetti] = useState(false);

  // Update selectedProvider when providers are loaded
  useEffect(() => {
    if (cloudProviders && cloudProviders.length > 0 && !selectedProvider) {
      setSelectedProvider(cloudProviders[0]);
    }
  }, [cloudProviders, selectedProvider]);

  const handleSpinEnd = (provider: CloudProvider) => {
    setSelectedProvider(provider);
    setShowResult(true);
    setShowConfetti(true);

    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    // Switch to project tab after 3 seconds
    setTimeout(() => {
      setShowResult(false);
      setActiveTab("project");
    }, 5000);
  };

  const handleProjectSelect = (projectName: string) => {
    setSelectedProject(projectName);
    setShowProjectResult(true);
    setShowProjectConfetti(true);

    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowProjectConfetti(false);
    }, 5000);

    // Hide dialog and switch to tracker tab after 3 seconds
    setTimeout(() => {
      setShowProjectResult(false);
      setActiveTab("tracker");
    }, 5000);
  };

  const handleContinue = (tab: string) => {
    setActiveTab(tab);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
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
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {showProjectConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          colors={["#FFD700", "#FFA500", "#FF6347"]}
        />
      )}

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              🎉 Cloud Provider Selected! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <div
              className="text-4xl font-bold mb-4"
              style={{ color: selectedProvider?.color }}
            >
              You got {selectedProvider?.name} !
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProjectResult} onOpenChange={setShowProjectResult}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              🚀 Project Selected! 🚀
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="text-2xl font-bold mb-4">You'll be deploying:</div>
            <div
              className="text-4xl font-bold mb-4"
              style={{ color: selectedProvider?.color }}
            >
              {selectedProject}
            </div>
            <div className="text-2xl font-bold mb-4">on</div>
            <div
              className="text-4xl font-bold mb-4"
              style={{ color: selectedProvider?.color }}
            >
              {selectedProvider?.name} !
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <motion.div
        className="container max-w-6xl mx-auto flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-4">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">
            Instant Infra ⚡️
          </h1>
        </motion.div>

        {/* New Info Tabs */}
        <Tabs defaultValue="rules" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="rules">
            <div className="text-muted-foreground max-w-lg py-2 mb-3">
              <ul className="text-left list-disc pl-6 space-y-2">
                <li>1. Spin the wheel to select a cloud provider</li>
                <li>2. Choose a deployment</li>
                <li>3. Record yourself doing it</li>
                <li>4. Save progress in the progress tracker</li>
              </ul>
            </div>
            <div className="text-muted-foreground max-w-lg py-2 mb-3">
              <p className="text-muted-foreground pt-2">
                * Try to do it in under 10-20 minutes
              </p>
              <p className="text-muted-foreground pt-2">
                * Try not to use AI to do this, unless seriously needed
              </p>
              <p className="text-muted-foreground pt-2">* Have fun!</p>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="text-muted-foreground max-w-lg py-4 mb-3">
              {/* Left blank for you to fill */}
            </div>
          </TabsContent>

          <TabsContent value="links">
            <div className="text-muted-foreground max-w-lg py-4 mb-3">
              <ul className="text-left list-disc pl-6 space-y-2">
                <li>
                  <a href="#" className="text-primary hover:underline">
                    YouTube Channel
                  </a>
                </li>
                {/* Add more links as needed */}
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* Existing Game Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="provider">Cloud Provider</TabsTrigger>
            <TabsTrigger value="project">Project Selection</TabsTrigger>
            <TabsTrigger value="tracker">Project Tracker</TabsTrigger>
          </TabsList>

          <TabsContent value="provider">
            <div className="w-full flex flex-col items-center justify-center">
              <SpinWheel providers={providers} onSpinEnd={handleSpinEnd} />
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
            <ProjectTracker
              providers={providers}
              deployments={deployments}
              challenges={challenges}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Index;
