import { SupabaseClient } from "@supabase/supabase-js";
import { StoryGroup } from "../models";

export const storyGroupService = {
  async getStoryGroupsByBoardId(
    supabase: SupabaseClient,
    boardId: string
  ): Promise<StoryGroup[]> {
    const { data, error } = await supabase
      .from("story_groups")
      .select("*")
      .eq("board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createStoryGroup(
    supabase: SupabaseClient,
    group: Omit<StoryGroup, "id" | "created_at" | "updated_at" | "sort_order">
  ): Promise<StoryGroup> {
    const { data: lastGroup, error: lastError } = await supabase
      .from("story_groups")
      .select("sort_order")
      .eq("board_id", group.board_id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastError) throw lastError;

    const nextSortOrder = (lastGroup?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("story_groups")
      .insert({
        ...group,
        sort_order: nextSortOrder,
      })
      .select("*")
      .single();

    if (error) throw error;
    return data as StoryGroup;
  },

  async updateStoryGroup(
    supabase: SupabaseClient,
    groupId: string,
    updates: Partial<StoryGroup>
  ): Promise<StoryGroup> {
    const { data, error } = await supabase
      .from("story_groups")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", groupId)
      .select("*")
      .single();

    if (error) throw error;
    return data as StoryGroup;
  },

  async deleteStoryGroup(
    supabase: SupabaseClient,
    groupId: string
  ): Promise<void> {
    const { error: updateError } = await supabase
      .from("stories")
      .update({ story_group_id: null })
      .eq("story_group_id", groupId);

    if (updateError) throw updateError;

    const { error: deleteError } = await supabase
      .from("story_groups")
      .delete()
      .eq("id", groupId);

    if (deleteError) throw deleteError;
  },
};
