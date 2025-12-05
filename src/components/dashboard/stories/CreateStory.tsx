"use client";

import {
  Button,
  CloseButton,
  Dialog,
  Field,
  HStack,
  Input,
  NumberInput,
  Portal,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useStories } from "@/hooks/useStories";
import { goodStoryTip } from "./tips/story-tips";
import { EmojiPickerDialog } from "@/components/utils/EmojiPickerDialog";

const StorySchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  story_points: z
    .number()
    .min(0, "Os pontos da história devem ser um número não negativo"),
});

type StoryValues = z.infer<typeof StorySchema>;

interface CreateStoryProps {
  isOpen: boolean;
  onClose: () => void;
  shouldRefetch?: (value: boolean) => void;
  storyGroupId?: string | null;
}

export default function CreateStory({
  isOpen,
  onClose,
  shouldRefetch,
  storyGroupId = null,
}: CreateStoryProps) {
  const params = useParams();
  const boardId = params.id as string;
  const { createStory, isLoading } = useStories(boardId);

  const {
    handleSubmit,
    formState: { errors },
    control,
    clearErrors,
    reset,
  } = useForm<StoryValues>({
    resolver: zodResolver(StorySchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      description: "",
      story_points: 0,
    },
  });

  const onSubmit = handleSubmit(async (data: StoryValues) => {
    try {
      await createStory({
        board_id: boardId,
        title: data.title,
        description: data.description,
        story_group_id: storyGroupId,
        story_points: data.story_points,
      });
      shouldRefetch?.(true);
      reset();
      onClose();
    } catch (error) {
      console.error("Erro ao criar história:", error);
    }
  });

  return (
    <Dialog.Root
      key="create-story-dialog"
      size={{ base: "sm", md: "lg", lg: "xl" }}
      open={isOpen === true}
      onOpenChange={(details) => {
        if (!details.open) {
          clearErrors();
          reset();
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header flexDir="column">
              <Dialog.Title>Criar História de Usuário</Dialog.Title>
              <Dialog.Title color="gray.600" fontSize="sm" fontWeight="normal">
                Adicione uma nova história no seu quadro
              </Dialog.Title>
            </Dialog.Header>
            <form onSubmit={onSubmit}>
              <Dialog.Body>
                <Stack gap="4" align="flex-start" flexDir="row" flexWrap="wrap">
                  <Field.Root invalid={!!errors.title} width="100%">
                    <Field.Label>Título</Field.Label>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <HStack align="center" gap="2">
                          <Input
                            w={{ base: "300px", md: "600px" }}
                            borderColor={{
                              base: "gray.200",
                              _dark: "gray.500",
                            }}
                            placeholder="Insira o título da história de usuário aqui... (ex: US.1)"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          <EmojiPickerDialog
                            key="create-story-emoji-picker"
                            onSelectEmoji={(emoji) => {
                              field.onChange((field.value || "") + emoji);
                            }}
                          />
                        </HStack>
                      )}
                    />
                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root invalid={!!errors.description} width="100%">
                    <Field.Label>Descrição</Field.Label>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <Textarea
                          borderColor={{ base: "gray.200", _dark: "gray.500" }}
                          placeholder="Insira a sua história de usuário aqui..."
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          maxLength={500}
                        />
                      )}
                    />
                    <Field.ErrorText>
                      {errors.description?.message}
                    </Field.ErrorText>
                  </Field.Root>
                  <Field.Root invalid={!!errors.story_points} width="100%">
                    <Field.Label>Pontos da História</Field.Label>
                    <Controller
                      control={control}
                      name="story_points"
                      render={({ field }) => (
                        <NumberInput.Root
                          min={0}
                          value={field.value?.toString() ?? "0"}
                          onValueChange={({ value }) => {
                            const numeric = Number(value);
                            field.onChange(Number.isNaN(numeric) ? 0 : numeric);
                          }}
                        >
                          <NumberInput.Control />
                          <NumberInput.Input />
                        </NumberInput.Root>
                      )}
                    />

                    <Field.ErrorText>
                      {errors.story_points?.message}
                    </Field.ErrorText>
                  </Field.Root>
                  {goodStoryTip()}
                </Stack>
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  size="sm"
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Criar história
                </Button>
              </Dialog.Footer>
            </form>
            <Dialog.CloseTrigger asChild>
              <CloseButton borderRadius="full" size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
