import React from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectTracker from "./ProjectTracker";
import { fetchCloudProviders } from "@/services/cloudProviderService";
import { fetchDeployments } from "@/services/deploymentsService";
import { fetchChallenges } from "@/services/challengesService";

const PublicProjectTracker = () => {
  const {
    data: cloudProviders,
    isLoading: isLoadingProviders,
    error: providersError,
  } = useQuery({
    queryKey: ["cloudProviders"],
    queryFn: fetchCloudProviders,
  });

  const {
    data: deployments,
    isLoading: isLoadingDeployments,
    error: deploymentsError,
  } = useQuery({
    queryKey: ["deployments"],
    queryFn: fetchDeployments,
  });

  const {
    data: challenges,
    isLoading: isLoadingChallenges,
    error: challengesError,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: fetchChallenges,
  });

  if (isLoadingProviders || isLoadingDeployments || isLoadingChallenges) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (providersError || deploymentsError || challengesError) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <div className="text-destructive">
          Failed to load data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <ProjectTracker
      providers={cloudProviders || []}
      deployments={deployments || []}
      challenges={challenges || []}
    />
  );
};

export default PublicProjectTracker;
