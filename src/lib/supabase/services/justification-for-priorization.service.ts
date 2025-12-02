import { SupabaseClient } from "@supabase/supabase-js";
import { Comment, JustificationsForPriorization } from "../models";

export const justificationForPriorizationService = {
  async createJustification(
    supabase: SupabaseClient,
    justification: Omit<
      JustificationsForPriorization,
      "id" | "created_at" | "updated_at"
    >
  ): Promise<JustificationsForPriorization> {
    const { data, error } = await supabase
      .from("justifications_for_priorization")
      .insert(justification)
      .select("*")
      .single();

    if (error) throw error;
    return data as JustificationsForPriorization;
  },

  async deleteJustification(
    supabase: SupabaseClient,
    justificationId: string
  ): Promise<JustificationsForPriorization | null> {
    const { data, error } = await supabase
      .from("justifications_for_priorization")
      .delete()
      .eq("id", justificationId)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return (data as JustificationsForPriorization) ?? null;
  },

  async getJustificationsByPriorizationTechniqueId(
    supabase: SupabaseClient,
    priorizationTechniqueId: string
  ): Promise<JustificationsForPriorization[]> {
    const { data, error } = await supabase
      .from("justifications_for_priorization")
      .select("*")
      .eq("priorization_technique_id", priorizationTechniqueId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as JustificationsForPriorization[]) ?? [];
  },
};
