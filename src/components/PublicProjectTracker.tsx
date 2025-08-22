import React from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectTracker from "./ProjectTracker";
import { fetchChallenges } from "@/services/challengesService";
import { fetchCloudProviders } from "@/services/cloudProviderService";

const PublicProjectTracker = () => {
  const {
    data: challenges,
    isLoading: isLoadingChallenges,
    error: challengesError,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: fetchChallenges,
  });

  const {
    data: cloudProviders,
    isLoading: isLoadingProviders,
    error: providersError,
  } = useQuery({
    queryKey: ["cloudProviders"],
    queryFn: fetchCloudProviders,
  });

  if (isLoadingChallenges || isLoadingProviders) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (challengesError || providersError) {
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
      challenges={challenges || []}
      providers={cloudProviders || []}
    />
  );
};

export default PublicProjectTracker;
