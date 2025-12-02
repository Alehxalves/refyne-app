"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { priorizationTechniqueService } from "@/lib/supabase/services/prioritization-technique.service";
import { PrioritizationTechnique } from "@/lib/supabase/models";

export function usePriorizationTechnique(storyId: string) {
  const { supabase } = useSupabase();
  const { isLoaded, isSignedIn } = useUser();
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } =
    useQuery<PrioritizationTechnique | null>({
      queryKey: ["priority", storyId],
      enabled: isLoaded && isSignedIn && !!supabase && !!storyId,
      queryFn: async () => {
        if (!supabase) throw new Error("Supabase client not available");
        return await priorizationTechniqueService.getPrioritizationTechniqueByStoryId(
          supabase,
          storyId
        );
      },
    });

  const upsertMutation = useMutation<
    PrioritizationTechnique,
    Error,
    Partial<PrioritizationTechnique>,
    { previous: PrioritizationTechnique | null }
  >({
    mutationFn: async (values: Partial<PrioritizationTechnique>) => {
      if (!supabase) throw new Error("Supabase client not available");

      const current =
        queryClient.getQueryData<PrioritizationTechnique | null>([
          "priority",
          storyId,
        ]) ?? null;

      return priorizationTechniqueService.upsertPrioritizationTechnique(
        supabase,
        storyId,
        {
          moscow: (values.moscow ?? current?.moscow)!,
          csd: (values.csd ?? current?.csd)!,
          gut_g_value: values.gut_g_value ?? current?.gut_g_value ?? 1,
          gut_u_value: values.gut_u_value ?? current?.gut_u_value ?? 1,
          gut_t_value: values.gut_t_value ?? current?.gut_t_value ?? 1,
          useMoscow: values.useMoscow ?? current?.useMoscow ?? true,
          useCsd: values.useCsd ?? current?.useCsd ?? false,
          useGut: values.useGut ?? current?.useGut ?? false,
        }
      );
    },

    onMutate: async (newValues) => {
      await queryClient.cancelQueries({ queryKey: ["priority", storyId] });

      const previous =
        queryClient.getQueryData<PrioritizationTechnique | null>([
          "priority",
          storyId,
        ]) ?? null;

      const optimistic: PrioritizationTechnique = {
        ...(previous ?? {}),
        ...newValues,
        updated_at: new Date().toISOString(),
      } as PrioritizationTechnique;

      queryClient.setQueryData<PrioritizationTechnique | null>(
        ["priority", storyId],
        optimistic
      );

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData<PrioritizationTechnique | null>(
          ["priority", storyId],
          ctx.previous
        );
      }
    },

    onSuccess: (saved) => {
      queryClient.setQueryData<PrioritizationTechnique | null>(
        ["priority", storyId],
        saved
      );
    },
  });

  function updatePriority(values: Partial<PrioritizationTechnique>) {
    return upsertMutation.mutateAsync(values);
  }

  return {
    priority: data,
    isLoading: isLoading || isFetching,
    error,
    updatePriority,
  };
}
