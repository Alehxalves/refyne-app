import { SupabaseClient } from "@supabase/supabase-js";
import { Feedback } from "../models";

export const feedbackService = {
  async createFeedback(
    supabase: SupabaseClient,
    feedback: Omit<Feedback, "id" | "created_at" | "updated_at">
  ): Promise<Feedback> {
    const { data, error } = await supabase
      .from("feedbacks")
      .insert(feedback)
      .select("*")
      .single();

    if (error) throw error;
    return data as Feedback;
  },

  async deleteFeedback(
    supabase: SupabaseClient,
    feedbackId: string
  ): Promise<Feedback | null> {
    const { data, error } = await supabase
      .from("feedbacks")
      .delete()
      .eq("id", feedbackId)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return (data as Feedback) ?? null;
  },

  async getFeedbacks(supabase: SupabaseClient): Promise<Feedback[]> {
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Feedback[]) ?? [];
  },

  async getFeedbacksByUserId(
    supabase: SupabaseClient,
    userId: string
  ): Promise<Feedback[]> {
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Feedback[]) ?? [];
  },
};
