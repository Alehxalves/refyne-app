import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storyService } from "@/lib/supabase/services/story.service";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { Story, StoryWithPrioritization } from "@/lib/supabase/models";

export function useStories(boardId: string) {
  return useStoriesBase(boardId, { archived: false });
}

export function useArchivedStories(boardId: string) {
  return useStoriesBase(boardId, { archived: true });
}

function useStoriesBase(boardId: string, { archived }: { archived: boolean }) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const {
    data: stories = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<StoryWithPrioritization[]>({
    queryKey: ["stories", boardId, archived ? "archived" : "active"],
    enabled: !!user && !!boardId && !!supabase,
    queryFn: async () =>
      storyService.getStoriesByBoardId(supabase!, boardId, { archived }),
  });

  const createStoryMutation = useMutation({
    mutationFn: async (storyData: {
      board_id: string;
      title: string;
      description: string;
      story_group_id?: string | null;
      story_points?: number;
    }) => storyService.createStory(supabase!, storyData as Story),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", boardId, archived ? "archived" : "active"],
      });
    },
  });

  const moveStoryToGroupMutation = useMutation({
    mutationFn: async (params: {
      storyId: string;
      story_group_id: string | null;
    }) =>
      storyService.updateStory(supabase!, params.storyId, {
        story_group_id: params.story_group_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", boardId, archived ? "archived" : "active"],
      });
    },
  });

  function moveStoryToGroup(storyId: string, story_group_id: string | null) {
    return moveStoryToGroupMutation.mutateAsync({ storyId, story_group_id });
  }

  const reorderStoryMutation = useMutation({
    mutationFn: async (params: { storyId: string; targetStoryId: string }) => {
      if (!supabase) throw new Error("Supabase client not available");
      await storyService.swapStoriesOrder(
        supabase,
        params.storyId,
        params.targetStoryId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", boardId, archived ? "archived" : "active"],
      });
    },
  });

  function reorderStory(storyId: string, targetStoryId: string) {
    return reorderStoryMutation.mutateAsync({ storyId, targetStoryId });
  }

  function refetch() {
    queryClient.invalidateQueries({
      queryKey: ["stories", boardId, archived ? "archived" : "active"],
    });
  }

  return {
    stories,
    isLoading,
    isFetching,
    error,
    createStory: createStoryMutation.mutateAsync,
    moveStoryToGroup,
    reorderStory,
    refetch,
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
  } = useQuery<StoryWithPrioritization | undefined>({
    queryKey: ["story", storyId],
    enabled: !!user && !!storyId && !!supabase,
    queryFn: async () => storyService.getStoryById(supabase!, storyId),
  });

  const updateStoryMutation = useMutation({
    mutationFn: async (updates: Partial<Story>) =>
      storyService.updateStory(supabase!, storyId, updates),

    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });

      queryClient.invalidateQueries({
        queryKey: ["stories", updated.board_id],
      });
    },
  });

  const archiveStoryMutation = useMutation({
    mutationFn: async () => storyService.archiveStory(supabase!, storyId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
      queryClient.invalidateQueries({
        queryKey: ["stories"],
      });
    },
  });

  const unarchiveStoryMutation = useMutation({
    mutationFn: async () => storyService.unarchiveStory(supabase!, storyId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
      queryClient.invalidateQueries({
        queryKey: ["stories"],
      });
    },
  });

  const deleteStoryMutation = useMutation({
    mutationFn: async () => storyService.deleteStory(supabase!, storyId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
      queryClient.invalidateQueries({
        queryKey: ["stories"],
      });
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
    unarchiveStory: unarchiveStoryMutation.mutateAsync,
    deleteStory: deleteStoryMutation.mutateAsync,

    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["story", storyId] }),
  };
}
