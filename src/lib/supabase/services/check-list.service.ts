import { SupabaseClient } from "@supabase/supabase-js";
import { CheckListItem, CheckListWithItems } from "../models";

export const checkListService = {
  async getCheckListsWithItemsByStoryId(
    supabase: SupabaseClient,
    storyId: string
  ): Promise<CheckListWithItems[]> {
    type RawItem = {
      id: string;
      check_list_id: string;
      title: string;
      is_checked: boolean;
      sort_order: number;
      created_at: string;
      updated_at: string;
    };

    type RawChecklist = {
      id: string;
      story_id: string;
      type: string;
      title: string;
      created_at: string;
      updated_at: string;
      check_list_items: RawItem[] | null;
    };

    const { data, error } = await supabase
      .from("check_lists")
      .select(
        `
      id,
      story_id,
      type,
      title,
      created_at,
      updated_at,
      check_list_items (
        id,
        check_list_id,
        title,
        is_checked,
        sort_order,
        created_at,
        updated_at
      )
    `
      )
      .eq("story_id", storyId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return (
      (data as RawChecklist[])?.map((row) => ({
        id: row.id,
        story_id: row.story_id,
        type: row.type,
        title: row.title,
        created_at: row.created_at,
        updated_at: row.updated_at,
        items:
          row.check_list_items
            ?.sort((a, b) => a.sort_order - b.sort_order)
            .map(
              (item): CheckListItem => ({
                id: item.id,
                check_list_id: item.check_list_id,
                title: item.title,
                is_checked: item.is_checked,
                sort_order: item.sort_order,
                created_at: item.created_at,
                updated_at: item.updated_at,
              })
            ) ?? [],
      })) ?? []
    );
  },

  async updateCheckListItemChecked(
    supabase: SupabaseClient,
    itemId: string,
    isChecked: boolean
  ): Promise<CheckListItem> {
    const { data, error } = await supabase
      .from("check_list_items")
      .update({
        is_checked: isChecked,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select(
        `
        id,
        check_list_id,
        title,
        is_checked,
        created_at,
        updated_at
      `
      )
      .single();

    if (error) throw error;
    return data as CheckListItem;
  },
};
