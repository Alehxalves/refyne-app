"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardService } from "@/lib/supabase/services/board.service";
import { Board } from "@/lib/supabase/models";
import { useUser } from "@clerk/nextjs";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";

export function useBoards() {
  const { user, isLoaded } = useUser();
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const isQueryEnabled = !!user && !!supabase;

  const {
    data: boards = [],
    isLoading: queryLoading,
    isFetching,
    error,
  } = useQuery<Board[], Error>({
    queryKey: ["boards", user?.id],
    enabled: isQueryEnabled,
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase client not available");
      if (!user) throw new Error("User not authenticated");

      return boardService.getBoards(supabase, user.id as string);
    },
  });

  const isLoading = !isLoaded || !isQueryEnabled || queryLoading;

  const createBoardMutation = useMutation<
    Board,
    Error,
    { title: string; description?: string; color?: string; text_color?: string }
  >({
    mutationFn: async (boardData) => {
      if (!supabase) throw new Error("Supabase client not available");
      if (!user) throw new Error("User not authenticated");

      return boardService.createBoard(supabase, {
        ...boardData,
        user_id: user.id as string,
      });
    },
    onSuccess: (newBoard) => {
      queryClient.setQueryData<Board[]>(["boards", user?.id], (old) =>
        old ? [newBoard, ...old] : [newBoard]
      );
    },
  });

  return {
    boards,
    isLoading,
    isFetching,
    error: error ? error.message : null,
    createBoard: createBoardMutation.mutateAsync,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["boards", user?.id] }),
  };
}

export function useBoard(boardId: string) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useQuery<Board | null, Error>({
    queryKey: ["board", boardId],
    enabled: !!user && !!supabase && !!boardId,
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase client not available");
      const result = await boardService.getBoard(supabase, boardId);
      return result ?? null;
    },
  });

  const board = data ?? null;

  const updateBoardMutation = useMutation<Board, Error, Partial<Board>>({
    mutationFn: async (updates) => {
      if (!supabase) throw new Error("Supabase client not available");
      return boardService.updateBoard(supabase, boardId, { ...updates });
    },
    onSuccess: (updatedBoard) => {
      queryClient.setQueryData<Board | null>(["board", boardId], updatedBoard);
      queryClient.setQueryData<Board[]>(
        ["boards", user?.id],
        (old) =>
          old?.map((b) => (b.id === updatedBoard.id ? updatedBoard : b)) ?? old
      );
    },
  });

  return {
    board,
    isLoading,
    isFetching,
    error: error?.message ?? null,
    updateBoard: updateBoardMutation.mutateAsync,
    isUpdating: updateBoardMutation.isPending,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
  };
}
