import { supabase } from "@/lib/supabase";
import { Challenge } from "@/types/challenge";
import { log } from "console";

export async function fetchChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from("challenges")
    .select(
      `
      id,
      is_done,
      created_at,
      providers:provider_id (
        name
      ),
      deployments:deployment_id (
        name
      )
    `,
    )
    .order("providers(name)", { ascending: true })
    .order("deployments(name)", { ascending: true });

  if (error) {
    console.error("Error fetching challenges:", error);
    return null;
  }

  const formattedData = data.map((challenge) => ({
    id: challenge.id,
    provider_name: challenge?.providers?.name,
    deployment_name: challenge?.deployments?.name,
    is_done: challenge.is_done,
    created_at: challenge.created_at,
  }));

  return formattedData;
}

export async function updateChallengeStatus(
  challengeId: string,
  isDone: boolean,
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("Current user:", user?.id);
  console.log("Attempting to update challenge:", { challengeId, isDone });

  // First verify the challenge exists
  const { data: existingChallenge, error: fetchError } = await supabase
    .from("challenges")
    .select()
    .eq("id", challengeId)
    .single();

  if (fetchError) {
    console.error("Error fetching challenge:", fetchError);
    return false;
  }

  if (!existingChallenge) {
    console.error("Challenge not found:", challengeId);
    return false;
  }

  const { data, error } = await supabase
    .from("challenges")
    .update({ is_done: isDone })
    .eq("id", challengeId)
    .select();

  if (error) {
    console.error("Error updating challenge status:", error);
    return false;
  }

  const wasUpdated = data && data.length > 0;
  console.log("Update response:", { data, wasUpdated });
  return wasUpdated;
}
