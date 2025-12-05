"use client";

import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  useToken,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useStoryGroups } from "@/hooks/useStoryGroups";
import { EmojiPickerDialog } from "@/components/utils/EmojiPickerDialog";

const StoryGroupSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  color: z.string().optional(),
});

type StoryGroupValues = z.infer<typeof StoryGroupSchema>;

interface CreateStoryGroupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateStoryGroup({
  isOpen,
  onClose,
}: CreateStoryGroupProps) {
  const params = useParams();
  const boardId = params.id as string;
  const { createStoryGroup } = useStoryGroups(boardId);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    clearErrors,
    reset,
  } = useForm<StoryGroupValues>({
    resolver: zodResolver(StoryGroupSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      color: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createStoryGroup({
        board_id: boardId,
        title: data.title,
        color: data.color || undefined,
      });
      reset();
      onClose();
    } catch (err) {
      console.error("Erro ao criar grupo de histórias:", err);
    }
  });

  const [blue500, green500, yellow500, red500, purple500, orange500, gray500] =
    useToken("colors", [
      "blue.500",
      "green.500",
      "yellow.500",
      "red.500",
      "purple.500",
      "orange.500",
      "gray.500",
    ]);

  const colorOptions = [
    blue500,
    green500,
    yellow500,
    red500,
    purple500,
    orange500,
    gray500,
  ];

  return (
    <Dialog.Root
      key="story-group-create"
      size={{ base: "sm", md: "lg", lg: "xl" }}
      open={isOpen === true}
      onOpenChange={() => {
        clearErrors();
        reset();
        onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header flexDir="column">
              <Dialog.Title>Criar grupo de histórias</Dialog.Title>
              <Dialog.Title color="gray.600" fontSize="sm" fontWeight="normal">
                Organize seu backlog em seções (grupos)
              </Dialog.Title>
            </Dialog.Header>
            <form onSubmit={onSubmit}>
              <Dialog.Body>
                <Stack gap="4">
                  <Field.Root invalid={!!errors.title}>
                    <Field.Label>Título do grupo</Field.Label>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <HStack align="center" gap="2">
                          <Input
                            w={{ base: "300px", md: "600px" }}
                            placeholder="Ex: Cadastro, Relatórios, Financeiro..."
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          />

                          <EmojiPickerDialog
                            key="sg-create-emoji-picker"
                            onSelectEmoji={(emoji) => {
                              field.onChange((field.value || "") + emoji);
                            }}
                          />
                        </HStack>
                      )}
                    />
                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.color}>
                    <Field.Label>Cor (opcional)</Field.Label>

                    <Controller
                      control={control}
                      name="color"
                      render={({ field }) => (
                        <Stack gap="2">
                          <HStack flexWrap="wrap" gap="2">
                            {colorOptions.map((color) => (
                              <Button
                                key={color}
                                borderRadius="full"
                                bg={color}
                                aria-label={`Selecionar cor ${color}`}
                                onClick={() => field.onChange(color)}
                                borderWidth={
                                  field.value === color ? "3px" : "0px"
                                }
                                borderColor={
                                  field.value === color
                                    ? "gray.800"
                                    : "transparent"
                                }
                                _hover={{
                                  transform: "scale(1.05)",
                                }}
                              />
                            ))}
                          </HStack>
                        </Stack>
                      )}
                    />
                    <Field.ErrorText>{errors.color?.message}</Field.ErrorText>
                  </Field.Root>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  size="sm"
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Criar grupo
                </Button>
              </Dialog.Footer>
            </form>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
