"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { checkListService } from "@/lib/supabase/services/check-list.service";
import { CheckListWithItems } from "@/lib/supabase/models";

export function useCheckLists(storyId: string) {
  const { supabase } = useSupabase();
  const { isLoaded, isSignedIn } = useUser();
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = useQuery<
    CheckListWithItems[],
    Error
  >({
    queryKey: ["checklists", storyId],
    enabled: isLoaded && isSignedIn && !!supabase && !!storyId,
    queryFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      const result = await checkListService.getCheckListsWithItemsByStoryId(
        supabase,
        storyId
      );

      return result.map((cl) => ({
        ...cl,
        items: [...cl.items],
      }));
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async (params: { itemId: string; isChecked: boolean }) => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      return checkListService.updateCheckListItemChecked(
        supabase,
        params.itemId,
        params.isChecked
      );
    },

    onMutate: async ({ itemId, isChecked }) => {
      await queryClient.cancelQueries({ queryKey: ["checklists", storyId] });

      const previousData =
        queryClient.getQueryData<CheckListWithItems[]>([
          "checklists",
          storyId,
        ]) || [];

      const nextData = previousData.map((cl) => ({
        ...cl,
        items: cl.items.map((item) =>
          item.id === itemId ? { ...item, is_checked: isChecked } : item
        ),
      }));

      queryClient.setQueryData<CheckListWithItems[]>(
        ["checklists", storyId],
        nextData
      );

      return { previousData };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["checklists", storyId], context.previousData);
      }
    },
  });

  function updateCheckItem(itemId: string, isChecked: boolean) {
    return updateItemMutation.mutateAsync({ itemId, isChecked });
  }

  return {
    checkLists: data,
    isLoading: isLoading || isFetching,
    error: error?.message ?? null,
    refetch,
    updateCheckItem,
  };
}
