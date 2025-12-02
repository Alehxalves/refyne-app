"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { justificationForPriorizationService } from "@/lib/supabase/services/justification-for-priorization.service";

export function useJustificationsForPriorization(
  priorizationTechniqueId: string
) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const {
    data: justifications = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["justifications_for_priorization", priorizationTechniqueId],
    enabled: !!user && !!priorizationTechniqueId,
    queryFn: async () =>
      justificationForPriorizationService.getJustificationsByPriorizationTechniqueId(
        supabase!,
        priorizationTechniqueId
      ),
  });

  const createJustificationMutation = useMutation({
    mutationFn: async (justificationData: {
      priorization_technique_id: string;
      avatar?: string;
      message: string;
    }) =>
      justificationForPriorizationService.createJustification(
        supabase!,
        justificationData
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["justifications_for_priorization", priorizationTechniqueId],
      });
    },
  });

  const deleteJustificationMutation = useMutation({
    mutationFn: async (justificationId: string) =>
      justificationForPriorizationService.deleteJustification(
        supabase!,
        justificationId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["justifications_for_priorization", priorizationTechniqueId],
      });
    },
  });

  return {
    justifications,
    isLoading,
    isFetching,
    error,

    createJustification: createJustificationMutation.mutateAsync,
    isCreating: createJustificationMutation.isPending,

    deleteJustification: deleteJustificationMutation.mutateAsync,
    isDeleting: deleteJustificationMutation.isPending,

    refetch: () =>
      queryClient.invalidateQueries({
        queryKey: ["justifications_for_priorization", priorizationTechniqueId],
      }),
  };
}
