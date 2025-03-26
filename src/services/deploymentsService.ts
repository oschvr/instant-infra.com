import { supabase } from "@/lib/supabase";
import { Deployment } from "@/types/deployment";

export async function fetchDeployments(): Promise<Deployment[]> {
  try {
    const { data, error } = await supabase.from("deployments").select("*");

    if (error) {
      console.error("Error fetching deployments:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch deployments:", error);
  }
}
