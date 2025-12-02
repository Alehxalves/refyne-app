"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { StoryGroup } from "@/lib/supabase/models";
import { storyGroupService } from "@/lib/supabase/services/story-group.service";

export function useStoryGroups(boardId: string) {
  const { supabase } = useSupabase();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const {
    data: storyGroups = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<StoryGroup[]>({
    queryKey: ["story-groups", boardId],
    enabled: !!user && !!supabase && !!boardId,
    queryFn: async () =>
      storyGroupService.getStoryGroupsByBoardId(supabase!, boardId),
  });

  const createMutation = useMutation<
    StoryGroup,
    Error,
    { board_id: string; title: string; color?: string }
  >({
    mutationFn: async (payload) => {
      if (!supabase) throw new Error("Supabase client not available");
      return storyGroupService.createStoryGroup(
        supabase,
        payload as StoryGroup
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-groups", boardId] });
    },
  });

  const updateMutation = useMutation<
    StoryGroup,
    Error,
    { groupId: string; updates: Partial<StoryGroup> }
  >({
    mutationFn: async ({ groupId, updates }) => {
      if (!supabase) throw new Error("Supabase client not available");
      return storyGroupService.updateStoryGroup(supabase, groupId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-groups", boardId] });
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (groupId) => {
      if (!supabase) throw new Error("Supabase client not available");
      return storyGroupService.deleteStoryGroup(supabase, groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-groups", boardId] });
    },
  });

  return {
    storyGroups,
    isLoading,
    isFetching,
    error,
    createStoryGroup: createMutation.mutateAsync,
    updateStoryGroup: updateMutation.mutateAsync,
    deleteStoryGroup: deleteMutation.mutateAsync,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["story-groups", boardId] }),
  };
}
