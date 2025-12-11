"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { feedbackService } from "@/lib/supabase/services/feedback.service";
import { Feedback } from "@/lib/supabase/models";

interface CreateFeedbackInput {
  rating: number;
  liked?: string;
  improvements?: string;
  would_recommend?: boolean;
}

export function useFeedbacks() {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const {
    data: feedbacks = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["feedbacks"],
    enabled: !!user && !!supabase,
    queryFn: async () => feedbackService.getFeedbacks(supabase!),
  });

  const createFeedbackMutation = useMutation({
    mutationFn: async (feedbackData: CreateFeedbackInput) =>
      feedbackService.createFeedback(supabase!, {
        user_id: user?.id ?? null,
        ...feedbackData,
      } as Feedback),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feedbacks"],
      });
    },
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: async (feedbackId: string) =>
      feedbackService.deleteFeedback(supabase!, feedbackId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feedbacks"],
      });
    },
  });

  return {
    feedbacks,
    isLoading,
    isFetching,
    error,

    createFeedback: createFeedbackMutation.mutateAsync,
    isCreating: createFeedbackMutation.isPending,

    deleteFeedback: deleteFeedbackMutation.mutateAsync,
    isDeleting: deleteFeedbackMutation.isPending,

    refetch: () => queryClient.invalidateQueries({ queryKey: ["feedbacks"] }),
  };
}
