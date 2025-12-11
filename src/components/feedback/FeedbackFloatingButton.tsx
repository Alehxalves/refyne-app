"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Field,
  Textarea,
  Checkbox,
  Portal,
  VStack,
  useMediaQuery,
  HStack,
  Text,
} from "@chakra-ui/react";
import { MessageCircle } from "lucide-react";
import { useFeedbacks } from "@/hooks/useFeedbacks";
import { toaster } from "../ui/toaster";

export function FeedbackFloatingButton() {
  const { createFeedback, isCreating } = useFeedbacks();
  const [isDesktop] = useMediaQuery(["(min-width: 768px)"]);

  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [liked, setLiked] = useState("");
  const [improvements, setImprovements] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(false);

  if (!isDesktop) {
    return null;
  }

  async function handleSubmitFeedback(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createFeedback({
        rating,
        liked: liked.trim() || undefined,
        improvements: improvements.trim() || undefined,
        would_recommend: wouldRecommend,
      });

      toaster.create({
        title: "Obrigado pelo feedback! 💜",
        type: "success",
        duration: 3000,
        closable: true,
      });

      setIsOpen(false);
      setRating(5);
      setLiked("");
      setImprovements("");
      setWouldRecommend(false);
    } catch (err) {
      console.error("Erro ao enviar feedback:", err);
      toaster.create({
        title: "Erro ao enviar feedback",
        description: "Tente novamente em alguns instantes.",
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  }

  return (
    <>
      <Box position="fixed" bottom="24px" right="24px" zIndex={30}>
        <Button
          borderRadius="full"
          size="sm"
          colorScheme="purple"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={16} />
          Feedback
        </Button>
      </Box>
      <Dialog.Root
        size="lg"
        open={isOpen}
        onOpenChange={(details) => {
          if (!details.open) {
            setIsOpen(false);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title fontSize="sm">
                  Compartilhe seu feedback
                </Dialog.Title>
                <Dialog.CloseTrigger />
              </Dialog.Header>

              <form onSubmit={handleSubmitFeedback}>
                <Dialog.Body>
                  <VStack align="flex-start" gap={3}>
                    <Field.Root>
                      <Field.Label fontSize="xs">
                        Sua nota para o Refyne
                      </Field.Label>

                      <HStack gap={1} mt={1}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="xs"
                            px="1.5"
                            onClick={() => setRating(star)}
                            aria-label={`Dar nota ${star}`}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill={star <= rating ? "#FBBF24" : "none"}
                              stroke={star <= rating ? "#F59E0B" : "#9CA3AF"}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="12 2 15 9 22 9 16.5 13.5 18.5 21 12 16.8 5.5 21 7.5 13.5 2 9 9 9 12 2" />
                            </svg>
                          </Button>
                        ))}
                      </HStack>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {rating} de 5
                      </Text>
                    </Field.Root>

                    <Field.Root>
                      <Field.Label fontSize="xs">
                        O que você mais gostou?
                      </Field.Label>
                      <Textarea
                        size="sm"
                        borderRadius="md"
                        value={liked}
                        onChange={(e) => setLiked(e.target.value)}
                        placeholder="Fluxo, clareza, IA, priorização..."
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label fontSize="xs">
                        O que podemos melhorar?
                      </Field.Label>
                      <Textarea
                        size="sm"
                        borderRadius="md"
                        value={improvements}
                        onChange={(e) => setImprovements(e.target.value)}
                        placeholder="Algo que confundiu, faltou ou poderia ser mais simples..."
                      />
                    </Field.Root>

                    <Checkbox.Root
                      checked={wouldRecommend}
                      onCheckedChange={(details) =>
                        setWouldRecommend(details.checked === true)
                      }
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control
                        bg={wouldRecommend ? "green.500" : "transparent"}
                        borderColor={wouldRecommend ? "transparent" : undefined}
                      >
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Label>
                        Eu recomendaria o Refyne para outros POs ou times
                      </Checkbox.Label>
                    </Checkbox.Root>
                  </VStack>
                </Dialog.Body>

                <Dialog.Footer>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    type="submit"
                    loading={isCreating}
                    disabled={isCreating}
                  >
                    Enviar feedback
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default FeedbackFloatingButton;
