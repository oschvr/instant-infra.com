import { useState, useEffect, useMemo } from "react";
import SpinWheel from "@/components/SpinWheel";
import CloudProviderResult from "@/components/Deployments";
import ProjectTracker from "@/components/ProjectTracker";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCloudProviders } from "@/services/cloudProviderService";
import { useQuery } from "@tanstack/react-query";
import { fetchDeployments } from "@/services/deploymentsService";
import ReactConfetti from "react-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchChallenges } from "@/services/challengesService";
import { CloudProvider } from "@/types/cloudProvider";
import { Deployment } from "@/types/deployment";
import { createChallenge } from "@/services/challengesService";
import { useQueryClient } from "@tanstack/react-query";

const Game = () => {
  const queryClient = useQueryClient();
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

  const [selectedProvider, setSelectedProvider] =
    useState<CloudProvider | null>(null);

  // Filter deployments to exclude already completed challenges for the selected provider
  const availableDeployments = useMemo(() => {
    if (!deployments || !challenges || !selectedProvider) {
      return deployments || [];
    }

    return deployments.filter((deployment) => {
      // Check if there's already a challenge with this provider and deployment combination
      const existingChallenge = challenges.find(
        (challenge) =>
          challenge.provider_name === selectedProvider.name &&
          challenge.deployment_name === deployment.name
      );
      return !existingChallenge;
    });
  }, [deployments, challenges, selectedProvider]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("tracker");
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

    // Hide confetti after 2 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 2000);

    // Switch to project tab after 2 seconds
    setTimeout(() => {
      setShowResult(false);
      setActiveTab("project");
    }, 2000);
  };

  const handlePlayGame = () => {
    setActiveTab("provider");
  };

  const handleProjectSelect = async (deployment: Deployment) => {
    setSelectedProject(deployment.name);
    setShowProjectResult(true);
    setShowProjectConfetti(true);

    // Create a new challenge in the database
    if (selectedProvider) {
      try {
        const newChallenge = await createChallenge(
          selectedProvider.id,
          deployment.id
        );
        if (newChallenge) {
          console.log("New challenge created:", newChallenge);
          // Optionally refresh the challenges data or update the UI
          queryClient.invalidateQueries({ queryKey: ["challenges"] });
          toast.success(
            `New challenge created: ${deployment.name} on ${selectedProvider.name}!`
          );
        }
      } catch (error) {
        console.error("Failed to create challenge:", error);
      }
    }

    // Hide confetti after 2 seconds
    setTimeout(() => {
      setShowProjectConfetti(false);
    }, 2000);

    // Hide dialog and switch to tracker tab after 2 seconds
    setTimeout(() => {
      setShowProjectResult(false);
      setActiveTab("tracker");
    }, 2000);
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
      <div className="container min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load cloud providers. Using default providers.");
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
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
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold gradient-text">
              🎉 Cloud Provider Selected! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <div
              className="text-4xl font-bold mb-4 animate-fade-in"
              style={{ color: selectedProvider?.color }}
            >
              You got {selectedProvider?.name}!
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProjectResult} onOpenChange={setShowProjectResult}>
        <DialogContent className="glass-panel sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold gradient-text">
              🚀 Project Selected! 🚀
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="text-2xl font-bold mb-4 text-muted-foreground">
              You'll be deploying:
            </div>
            <div className="text-4xl font-bold mb-4 gradient-text animate-fade-in">
              {selectedProject}
            </div>
            <div className="text-2xl font-bold mb-4 text-muted-foreground">
              on
            </div>
            <div
              className="text-4xl font-bold mb-4 animate-fade-in"
              style={{ color: selectedProvider?.color }}
            >
              {selectedProvider?.name}!
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container py-8">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="w-full">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-secondary/50 p-1 rounded-lg">
                <TabsTrigger
                  value="tracker"
                  className="rounded-md px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                >
                  Tracker
                </TabsTrigger>
                <TabsTrigger
                  value="provider"
                  className="rounded-md px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                >
                  Cloud Provider
                </TabsTrigger>
                <TabsTrigger
                  value="project"
                  className="rounded-md px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                >
                  Project
                </TabsTrigger>
              </TabsList>

              <TabsContent value="provider" className="mt-8">
                <SpinWheel
                  providers={cloudProviders || []}
                  onSpinEnd={handleSpinEnd}
                />
              </TabsContent>

              <TabsContent value="project" className="mt-8">
                {availableDeployments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-2xl font-bold text-muted-foreground mb-4">
                      🎉 All challenges completed for {selectedProvider?.name}!
                    </p>
                    <p className="text-lg text-muted-foreground">
                      Try spinning for a different cloud provider.
                    </p>
                  </div>
                ) : (
                  <CloudProviderResult
                    provider={selectedProvider!}
                    deployments={availableDeployments}
                    onProjectSelect={handleProjectSelect}
                    onClickContinue={() => setActiveTab("tracker")}
                  />
                )}
              </TabsContent>

              <TabsContent value="tracker" className="mt-8">
                {(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && (
                  <div className="mb-8 flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayGame}
                      className="button-shine text-3xl font-bold px-12 py-6 rounded-xl shadow-xl bg-primary text-primary-foreground hover:shadow-2xl transition-all duration-300"
                    >
                      🎮 Play
                    </motion.button>
                  </div>
                )}
                <ProjectTracker
                  providers={cloudProviders || []}
                  challenges={challenges || []}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default Game;
