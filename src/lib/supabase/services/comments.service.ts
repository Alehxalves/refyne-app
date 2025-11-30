import { SupabaseClient } from "@supabase/supabase-js";
import { Comment } from "../models";

export const commentService = {
  async createComment(
    supabase: SupabaseClient,
    comment: Omit<Comment, "id" | "created_at" | "updated_at">
  ): Promise<Comment> {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select("*")
      .single();

    if (error) throw error;
    return data as Comment;
  },

  async deleteComment(
    supabase: SupabaseClient,
    commentId: string
  ): Promise<Comment | null> {
    const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return (data as Comment) ?? null;
  },

  async getCommentsByStoryId(
    supabase: SupabaseClient,
    storyId: string
  ): Promise<Comment[]> {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("story_id", storyId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Comment[]) ?? [];
  },
};
