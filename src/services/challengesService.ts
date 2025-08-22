import { localDatabase } from "@/lib/localDatabase";
import { Challenge } from "@/types/challenge";

export async function fetchChallenges(): Promise<Challenge[]> {
  try {
    return await localDatabase.fetchChallenges();
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return [];
  }
}

export async function updateChallengeStatus(
  challengeId: string,
  isDone: boolean,
): Promise<boolean> {
  try {
    return await localDatabase.updateChallengeStatus(challengeId, isDone);
  } catch (error) {
    console.error("Error updating challenge status:", error);
    return false;
  }
}

export async function createChallenge(
  providerId: string,
  deploymentId: string,
): Promise<Challenge | null> {
  try {
    return await localDatabase.createChallenge(providerId, deploymentId);
  } catch (error) {
    console.error("Error creating challenge:", error);
    return null;
  }
}
