import { SupabaseClient } from "@supabase/supabase-js";
import { Story } from "../models";

export const storyService = {
  async createStory(
    supabase: SupabaseClient,
    story: Omit<
      Story,
      | "id"
      | "created_at"
      | "updated_at"
      | "default_priority"
      | "sort_order"
      | "story_group_id"
      | "archived"
    >
  ): Promise<Story> {
    const { data: createdStory, error } = await supabase
      .from("stories")
      .insert(story)
      .select()
      .single();

    if (error) throw error;

    const { data: checklist, error: checklistError } = await supabase
      .from("check_lists")
      .insert({
        story_id: createdStory.id,
        type: "INVEST",
        title: "Checklist INVEST",
      })
      .select()
      .single();

    if (checklistError) throw checklistError;

    const investItems = [
      { title: "Independente" },
      { title: "Negociável" },
      { title: "Valiosa" },
      { title: "Estimável" },
      { title: "Pequena" },
      { title: "Testável" },
    ];

    const { error: itemsError } = await supabase
      .from("check_list_items")
      .insert(
        investItems.map((item, index) => ({
          check_list_id: checklist.id,
          title: item.title,
          is_checked: false,
          sort_order: index,
        }))
      );

    if (itemsError) throw itemsError;

    return createdStory;
  },
  async updateStory(
    supabase: SupabaseClient,
    storyId: string,
    updates: Partial<Story>
  ): Promise<Story> {
    const { data, error } = await supabase
      .from("stories")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", storyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  async archiveStory(supabase: SupabaseClient, storyId: string): Promise<void> {
    const { error } = await supabase
      .from("stories")
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq("id", storyId);

    if (error) throw error;
  },
  async deleteStory(supabase: SupabaseClient, storyId: string): Promise<void> {
    const { error } = await supabase.from("stories").delete().eq("id", storyId);

    if (error) throw error;
  },
  async getStoryById(
    supabase: SupabaseClient,
    storyId: string
  ): Promise<Story> {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("id", storyId)
      .single();

    if (error) throw error;
    return data || {};
  },

  async getStoriesByBoardId(
    supabase: SupabaseClient,
    boardId: string
  ): Promise<Story[]> {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("board_id", boardId)
      .eq("archived", false)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
