import { SupabaseClient } from "@supabase/supabase-js";
import { Story, StoryWithPrioritization } from "../models";

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
    const { data: lastStory, error: lastError } = await supabase
      .from("stories")
      .select("sort_order")
      .eq("board_id", story.board_id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastError) throw lastError;

    const nextSortOrder = (lastStory?.sort_order ?? -1) + 1;

    const { data: createdStory, error } = await supabase
      .from("stories")
      .insert({
        ...story,
        sort_order: nextSortOrder,
      })
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

    return createdStory as Story;
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
  ): Promise<StoryWithPrioritization> {
    const { data, error } = await supabase
      .from("stories")
      .select(
        `
      *,
      prioritization_technique:prioritization_techniques(*)
    `
      )
      .eq("id", storyId)
      .single();

    if (error) throw error;
    return data as StoryWithPrioritization;
  },

  async getStoriesByBoardId(
    supabase: SupabaseClient,
    boardId: string
  ): Promise<StoryWithPrioritization[]> {
    const { data, error } = await supabase
      .from("stories")
      .select(
        `
      *,
      prioritization_technique:prioritization_techniques(*)
    `
      )
      .eq("board_id", boardId)
      .eq("archived", false)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []) as StoryWithPrioritization[];
  },

  async swapStoriesOrder(
    supabase: SupabaseClient,
    storyId: string,
    targetStoryId: string
  ): Promise<void> {
    const { data, error } = await supabase
      .from("stories")
      .select("id, sort_order, board_id, story_group_id")
      .in("id", [storyId, targetStoryId]);

    if (error) throw error;
    if (!data || data.length !== 2) return;

    const [s1, s2] = data;
    if (s1.board_id !== s2.board_id) {
      return;
    }

    const now = new Date().toISOString();

    const { error: updateError1 } = await supabase
      .from("stories")
      .update({ sort_order: s2.sort_order, updated_at: now })
      .eq("id", s1.id);

    if (updateError1) throw updateError1;

    const { error: updateError2 } = await supabase
      .from("stories")
      .update({ sort_order: s1.sort_order, updated_at: now })
      .eq("id", s2.id);

    if (updateError2) throw updateError2;
  },
};
