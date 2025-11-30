import { SupabaseClient } from "@supabase/supabase-js";
import { Board } from "../models";

export const boardService = {
  async createBoard(
    supabase: SupabaseClient,
    board: Omit<Board, "id" | "created_at" | "updated_at">
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .insert(board)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBoard(
    supabase: SupabaseClient,
    boardId: string,
    updates: Partial<Board>
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", boardId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getBoards(supabase: SupabaseClient, user_id: string): Promise<Board[]> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", user_id)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getBoard(supabase: SupabaseClient, id: string): Promise<Board | null> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },
};
