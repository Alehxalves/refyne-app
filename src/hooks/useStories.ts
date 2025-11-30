import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storyService } from "@/lib/supabase/services/story.service";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { Story } from "@/lib/supabase/models";

export function useStories(boardId: string) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const {
    data: stories = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["stories", boardId],
    enabled: !!user && !!boardId,
    queryFn: async () => storyService.getStoriesByBoardId(supabase!, boardId),
  });

  const createStoryMutation = useMutation({
    mutationFn: async (storyData: {
      board_id: string;
      title: string;
      description: string;
      story_group_id?: string | null;
    }) => storyService.createStory(supabase!, storyData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", boardId],
      });
    },
  });

  return {
    stories,
    isLoading,
    isFetching,
    error,
    createStory: createStoryMutation.mutateAsync,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["stories", boardId] }),
  };
}

export function useStory(storyId: string) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const {
    data: story,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["story", storyId],
    enabled: !!user && !!storyId,
    queryFn: async () => storyService.getStoryById(supabase!, storyId),
  });

  const updateStoryMutation = useMutation({
    mutationFn: async (updates: Partial<Story>) =>
      storyService.updateStory(supabase!, storyId, updates),

    onSuccess: (updated) => {
      queryClient.setQueryData(["story", storyId], updated);

      queryClient.setQueryData<Story[]>(
        ["stories", updated.board_id],
        (old) =>
          old?.map((s) => (s.id === updated.id ? (updated as Story) : s)) ?? old
      );
    },
  });

  const archiveStoryMutation = useMutation({
    mutationFn: async () => storyService.archiveStory(supabase!, storyId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const deleteStoryMutation = useMutation({
    mutationFn: async () => storyService.deleteStory(supabase!, storyId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  return {
    story,
    isLoading,
    isFetching,
    error,

    updateStory: updateStoryMutation.mutateAsync,
    isUpdating: updateStoryMutation.isPending,
    archiveStory: archiveStoryMutation.mutateAsync,
    deleteStory: deleteStoryMutation.mutateAsync,

    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["story", storyId] }),
  };
}
