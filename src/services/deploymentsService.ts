import { localDatabase } from "@/lib/localDatabase";
import { Deployment } from "@/types/deployment";

export async function fetchDeployments(): Promise<Deployment[]> {
  try {
    return await localDatabase.fetchDeployments();
  } catch (error) {
    console.error("Failed to fetch deployments:", error);
    return [];
  }
}
