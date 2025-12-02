import { SupabaseClient } from "@supabase/supabase-js";
import { PrioritizationTechnique } from "../models";
import { CSD_LEVEL, MOSCOW_LEVEL } from "../enums";

export const priorizationTechniqueService = {
  async getPrioritizationTechniqueByStoryId(
    supabase: SupabaseClient,
    storyId: string
  ): Promise<PrioritizationTechnique | null> {
    const { data, error } = await supabase
      .from("prioritization_techniques")
      .select("*")
      .eq("story_id", storyId)
      .maybeSingle();

    if (error) throw error;
    return data ?? null;
  },

  async upsertPrioritizationTechnique(
    supabase: SupabaseClient,
    storyId: string,
    values: {
      moscow: MOSCOW_LEVEL;
      csd: CSD_LEVEL;
      gut_g_value: number;
      gut_u_value: number;
      gut_t_value: number;
      useMoscow: boolean;
      useCsd: boolean;
      useGut: boolean;
    }
  ): Promise<PrioritizationTechnique> {
    const { data, error } = await supabase
      .from("prioritization_techniques")
      .upsert(
        {
          story_id: storyId,
          ...values,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "story_id" }
      )
      .select("*")
      .single();

    if (error) throw error;
    return data as PrioritizationTechnique;
  },
};
