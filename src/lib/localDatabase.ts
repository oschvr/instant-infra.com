import { Challenge } from "@/types/challenge";
import { CloudProvider } from "@/types/cloudProvider";
import { Deployment } from "@/types/deployment";

// Define the structure for the stored data
interface StoredChallenge {
  id: string;
  provider_id: string;
  deployment_id: string;
  is_done: boolean;
  created_at: string;
}

interface StoredData {
  challenges: StoredChallenge[];
  providers: CloudProvider[];
  deployments: Deployment[];
}

// Default data structure
const defaultData: StoredData = {
  challenges: [
    {
      id: "1",
      provider_id: "aws",
      deployment_id: "basic-vm",
      is_done: false,
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      provider_id: "gcp",
      deployment_id: "static-website",
      is_done: true,
      created_at: "2024-01-02T00:00:00Z",
    },
    {
      id: "3",
      provider_id: "azure",
      deployment_id: "database",
      is_done: false,
      created_at: "2024-01-03T00:00:00Z",
    },
    {
      id: "4",
      provider_id: "aws",
      deployment_id: "storage-bucket",
      is_done: true,
      created_at: "2024-01-03T00:00:00Z",
    },
  ],
  providers: [
    { id: "aws", name: "AWS", color: "#FF9900" },
    { id: "gcp", name: "GCP", color: "#4285F4" },
    { id: "azure", name: "Azure", color: "#0078D4" },
    { id: "oracle", name: "Oracle", color: "#F80000" },
  ],
  deployments: [
    {
      id: "kubernetes-cluster",
      name: "Kubernetes Cluster",
    },
    { id: "basic-vm", name: "Basic VM" },
    { id: "static-website", name: "Static Website" },
    { id: "database", name: "Database" },
    { id: "storage-bucket", name: "Storage bucket" },
    { id: "message-queue", name: "Message Queue" },
    {
      id: "container-registry",
      name: "Container Registry",
    },
    { id: "argocd", name: "K8S: ArgoCD" },
    { id: "ingress-nginx", name: "K8S: Ingress Nginx" },
    { id: "eck-stack", name: "K8S: ECK Stack" },
    {
      id: "kube-prometheus-stack",
      name: "K8S: Kube Prometheus Stack",
    },
  ],
};

// Helper functions for localStorage persistence
const getLocalData = (): StoredData => {
  try {
    const stored = localStorage.getItem("instantInfraData");
    return stored ? JSON.parse(stored) : defaultData;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultData;
  }
};

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
    const localData = getLocalData();
    return localData.challenges.map((challenge: StoredChallenge) => {
      const provider = localData.providers.find(
        (p: CloudProvider) => p.id === challenge.provider_id,
      );
      const deployment = localData.deployments.find(
        (d: Deployment) => d.id === challenge.deployment_id,
      );

      return {
        id: challenge.id,
        provider_name: provider?.name || "Unknown",
        deployment_name: deployment?.name || "Unknown",
        is_done: challenge.is_done,
        created_at: challenge.created_at,
      };
    });
  },

  async updateChallengeStatus(
    challengeId: string,
    isDone: boolean,
  ): Promise<boolean> {
    const localData = getLocalData();
    const challenge = localData.challenges.find(
      (c: StoredChallenge) => c.id === challengeId,
    );
    if (challenge) {
      challenge.is_done = isDone;
      return saveLocalData(localData);
    }
    return false;
  },

  // Cloud Providers
  async fetchCloudProviders(): Promise<CloudProvider[]> {
    const localData = getLocalData();
    return localData.providers;
  },

  // Deployments
  async fetchDeployments(): Promise<Deployment[]> {
    const localData = getLocalData();
    return localData.deployments;
  },

  // Create new challenge
  async createChallenge(
    providerId: string,
    deploymentId: string,
  ): Promise<Challenge | null> {
    const localData = getLocalData();
    const provider = localData.providers.find(
      (p: CloudProvider) => p.id === providerId,
    );
    const deployment = localData.deployments.find(
      (d: Deployment) => d.id === deploymentId,
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
    };

    localData.challenges.push({
      id: newChallenge.id,
      provider_id: providerId,
      deployment_id: deploymentId,
      is_done: false,
      created_at: newChallenge.created_at,
    });

    // Save the updated data to localStorage
    if (saveLocalData(localData)) {
      return newChallenge;
    }

    return null;
  },

  // Export data (useful for backup)
  async exportData(): Promise<string> {
    const localData = getLocalData();
    return JSON.stringify(localData, null, 2);
  },
};
