"use client";

import { boardService } from "@/lib/supabase/services/board.service";
import { Board } from "@/lib/supabase/models";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";

export function useBoards() {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadBoards() {
    if (!user) throw new Error("User not authenticated");

    setIsLoading(true);
    try {
      const boardsData = await boardService.getBoards(
        supabase!,
        user.id as string
      );
      setBoards(boardsData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os quadros."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
    text_color?: string;
  }) {
    if (!user) throw new Error("User not authenticated");

    setIsLoading(true);
    try {
      const newBoard = await boardService.createBoard(supabase!, {
        ...boardData,
        user_id: user.id as string,
      });

      setBoards((prevBoards) => [newBoard, ...prevBoards]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível criar o quadro."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadBoards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, user]);

  return { boards, isLoading, error, createBoard };
}

export function useBoard(boardId: string) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadBoard() {
    if (!user) throw new Error("User not authenticated");
    if (!boardId) return;

    setIsLoading(true);
    try {
      const board = await boardService.getBoard(supabase!, boardId);
      setBoard(board);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar o quadro."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function updateBoard(updates: Partial<Board>) {
    if (!user) throw new Error("User not authenticated");

    setIsLoading(true);
    try {
      const updatedBoard = await boardService.updateBoard(supabase!, boardId, {
        ...updates,
      });
      setBoard(updatedBoard);
      return updatedBoard;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o quadro."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, user]);

  return { board, isLoading, error, loadBoard, updateBoard };
}
