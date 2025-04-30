import { supabase } from "@/lib/supabase";
import { Challenge } from "@/types/challenge";

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
  const { data, error } = await supabase
    .from("challenges")
    .update({ is_done: isDone })
    .eq("id", challengeId)
    .select();

  if (error) return false;
  return data && data.length > 0;
}
