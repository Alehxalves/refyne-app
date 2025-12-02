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
import React, { useEffect } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useStoryGroups } from "@/hooks/useStoryGroups";
import { StoryGroup } from "@/lib/supabase/models";

const StoryGroupSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  color: z.string().optional(),
});

type StoryGroupValues = z.infer<typeof StoryGroupSchema>;

interface UpdateStoryGroupProps {
  isOpen: boolean;
  onClose: () => void;
  group: StoryGroup | null;
}

export default function UpdateStoryGroup({
  isOpen,
  onClose,
  group,
}: UpdateStoryGroupProps) {
  const params = useParams();
  const boardId = params.id as string;
  const { updateStoryGroup } = useStoryGroups(boardId);

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
      title: group?.title ?? "",
      color: group?.color ?? "",
    },
  });

  useEffect(() => {
    if (group) {
      reset({
        title: group.title ?? "",
        color: group.color ?? "",
      });
    }
  }, [group, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (!group) return;

    try {
      await updateStoryGroup({
        groupId: group.id,
        updates: {
          title: data.title,
          color: data.color ?? "",
        },
      });

      reset();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar grupo de histórias:", err);
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
      key="sg-edit"
      size="md"
      open={isOpen === true}
      onOpenChange={(details) => {
        if (!details.open) {
          clearErrors();
          reset({
            title: group?.title ?? "",
            color: group?.color ?? "",
          });
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header flexDir="column">
              <Dialog.Title>Editar grupo de histórias</Dialog.Title>
              <Dialog.Title color="gray.600" fontSize="sm" fontWeight="normal">
                Ajuste o título e a cor deste grupo
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
                        <Input
                          placeholder="Ex: Cadastro, Relatórios, Financeiro..."
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
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
                  Salvar alterações
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
