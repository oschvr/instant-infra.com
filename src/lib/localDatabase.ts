import { Challenge } from "@/types/challenge";
import { CloudProvider } from "@/types/cloudProvider";
import { Deployment } from "@/types/deployment";
import localData from "@/data/localData.json";

// Define the structure for the stored data
interface StoredChallenge {
  id: string;
  provider_id: string;
  deployment_id: string;
  is_done: boolean;
  created_at: string;
  video_url?: string;
}

interface StoredData {
  challenges: StoredChallenge[];
  providers: CloudProvider[];
  deployments: Deployment[];
}

const saveLocalData = (data: StoredData): boolean => {
  try {
    localStorage.setItem("instantInfraData", JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
};

export const localDatabase = {
  // Challenges
  async fetchChallenges(): Promise<Challenge[]> {
    return localData.challenges.map((challenge: StoredChallenge) => {
      const provider = localData.providers.find(
        (p: CloudProvider) => p.id === challenge.provider_id
      );
      const deployment = localData.deployments.find(
        (d: Deployment) => d.id === challenge.deployment_id
      );

      return {
        id: challenge.id,
        provider_name: provider?.name || "Unknown",
        deployment_name: deployment?.name || "Unknown",
        is_done: challenge.is_done,
        created_at: challenge.created_at,
        video_url: challenge.video_url || "",
      };
    });
  },

  async updateChallengeStatus(
    challengeId: string,
    isDone: boolean
  ): Promise<boolean> {
    const challenge = localData.challenges.find(
      (c: StoredChallenge) => c.id === challengeId
    );
    if (challenge) {
      challenge.is_done = isDone;
      return saveLocalData(localData);
    }
    return false;
  },

  // Cloud Providers
  async fetchCloudProviders(): Promise<CloudProvider[]> {
    return localData.providers;
  },

  // Deployments
  async fetchDeployments(): Promise<Deployment[]> {
    return localData.deployments;
  },

  // Create new challenge
  async createChallenge(
    providerId: string,
    deploymentId: string
  ): Promise<Challenge | null> {
    const provider = localData.providers.find(
      (p: CloudProvider) => p.id === providerId
    );
    const deployment = localData.deployments.find(
      (d: Deployment) => d.id === deploymentId
    );

    if (!provider || !deployment) {
      return null;
    }

    const newChallenge: Challenge = {
      id: Date.now().toString(),
      provider_name: provider.name,
      deployment_name: deployment.name,
      is_done: false,
      created_at: new Date().toISOString(),
      video_url: "",
    };

    localData.challenges.push({
      id: newChallenge.id,
      provider_id: providerId,
      deployment_id: deploymentId,
      is_done: false,
      created_at: newChallenge.created_at,
      video_url: "",
    });

    // Save the updated data to localStorage
    if (saveLocalData(localData)) {
      return newChallenge;
    }

    return null;
  },

  // Export data (useful for backup)
  async exportData(): Promise<string> {
    return JSON.stringify(localData, null, 2);
  },
};
