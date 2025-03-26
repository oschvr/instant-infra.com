import { supabase } from "@/lib/supabase";
import { CloudProvider } from "@/types/cloudProvider";

export async function fetchCloudProviders(): Promise<CloudProvider[]> {
  try {
    const { data, error } = await supabase.from("providers").select("*");

    if (error) {
      console.error("Error fetching cloud providers:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch cloud providers:", error);
    // Return default providers as fallback
    return [
      { id: "aws", name: "AWS", color: "#FF9900" },
      { id: "gcp", name: "GCP", color: "#4285F4" },
      { id: "azure", name: "Azure", color: "#0078D4" },
      { id: "oracle", name: "Oracle", color: "#F80000" },
    ];
  }
}
