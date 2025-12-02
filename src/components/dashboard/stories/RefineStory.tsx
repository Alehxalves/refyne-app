"use client";

import { useCheckLists } from "@/hooks/useChecklists";
import { useStory } from "@/hooks/useStories";
import { useComments } from "@/hooks/useComments";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CheckboxCheckedChangeDetails,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Separator,
  Stack,
  Text,
  Textarea,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { goodStoryTip } from "./tips/story-tips";
import { investTip } from "./tips/dor-tips";
import { Story } from "@/lib/supabase/models";
import { useUser } from "@clerk/nextjs";
import { Trash } from "lucide-react";
import { EmojiPickerDialog } from "@/components/utils/EmojiPickerDialog";

const StorySchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
});

type StoryValues = z.infer<typeof StorySchema>;

interface RefineStoryProps {
  storyId: string;
  isOpen: boolean;
  onClose: () => void;
}

const MAX_COMMENT_LENGTH = 255;

export default function RefineStory({
  storyId,
  isOpen,
  onClose,
}: RefineStoryProps) {
  const { user } = useUser();
  const { story, updateStory } = useStory(storyId);
  const { checkLists, error, updateCheckItem } = useCheckLists(storyId);

  const {
    comments,
    isLoading: isLoadingComments,
    isCreating,
    createComment,
    deleteComment,
  } = useComments(storyId);

  const [newComment, setNewComment] = useState("");

  const {
    control,
    formState: { errors },
    clearErrors,
    reset,
    trigger,
    getValues,
  } = useForm<StoryValues>({
    resolver: zodResolver(StorySchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (story && isOpen) {
      reset({
        title: story.title ?? "",
        description: story.description ?? "",
      });
    }
  }, [story, isOpen, reset]);

  const investChecklist = checkLists?.find((cl) => cl.type === "INVEST");

  async function handleBlurField(fieldName: keyof StoryValues) {
    const isValid = await trigger(fieldName);
    if (!isValid || !story) return;

    const value = getValues(fieldName);
    if (value === (story as Story)[fieldName]) return;

    try {
      await updateStory({ [fieldName]: value } as Partial<Story>);
    } catch (err) {
      console.error("Erro ao atualizar história:", err);
    }
  }

  async function handleAddComment() {
    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      await createComment({
        story_id: storyId,
        avatar: user?.imageUrl || undefined,
        context: "INVEST",
        message: trimmed,
      });
      setNewComment("");
    } catch (err) {
      console.error("Erro ao criar comentário:", err);
    }
  }

  return (
    <Dialog.Root
      size={{ base: "sm", sm: "lg", md: "xl", lg: "xl" }}
      open={isOpen === true}
      onOpenChange={(details) => {
        if (!details.open) {
          clearErrors();
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header flexDir="column">
              <Dialog.Title fontSize={{ base: "sm", sm: "md", lg: "md" }}>
                Refinar História de Usuário com INVEST
              </Dialog.Title>
              {error && (
                <Text fontSize="xs" color="red.500" mt="1">
                  {String(error)}
                </Text>
              )}
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap="4" align="flex-start" flexDir="row" flexWrap="wrap">
                <Field.Root invalid={!!errors.title} width="100%">
                  <Field.Label
                    fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                    fontWeight="bold"
                  >
                    Título
                  </Field.Label>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <Input
                        borderColor={{ base: "gray.200", _dark: "gray.500" }}
                        placeholder="Ex: US.1 - Registrar notas dos alunos"
                        {...field}
                        onBlur={async () => {
                          field.onBlur();
                          await handleBlurField("title");
                        }}
                      />
                    )}
                  />
                  <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!errors.description} width="100%">
                  <Field.Label
                    fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                    fontWeight="bold"
                  >
                    Descrição
                  </Field.Label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Textarea
                        fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                        borderColor={{ base: "gray.200", _dark: "gray.500" }}
                        placeholder="Como [persona], eu quero [algo] para [benefício/resultado]."
                        minH="120px"
                        {...field}
                        onBlur={async () => {
                          field.onBlur();
                          await handleBlurField("description");
                        }}
                      />
                    )}
                  />
                  <Field.ErrorText>
                    {errors.description?.message}
                  </Field.ErrorText>
                </Field.Root>
                {goodStoryTip()}
                <Separator w="100%" />
                {investChecklist && (
                  <Box width="100%">
                    <Text
                      fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                      fontWeight="bold"
                      mb="2"
                      _dark={{ color: "gray.200" }}
                    >
                      {investChecklist.title}
                    </Text>
                    <Stack gap="2">
                      {investChecklist.items.map((item) => (
                        <Checkbox.Root
                          key={item.id}
                          checked={item.is_checked}
                          onCheckedChange={(
                            details: CheckboxCheckedChangeDetails
                          ) => {
                            updateCheckItem(item.id, details.checked === true);
                          }}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control
                            bg={item.is_checked ? "green.500" : undefined}
                          >
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Label
                            fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                          >
                            {item.title}
                          </Checkbox.Label>
                        </Checkbox.Root>
                      ))}
                    </Stack>
                  </Box>
                )}
                {investTip()}
                <Box w="100%" mt="4">
                  <Text
                    fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                    fontWeight="bold"
                    mb="2"
                  >
                    Comentários sobre o refinamento
                  </Text>
                  <Stack gap="2" mb="3">
                    <Textarea
                      fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                      borderColor={{ base: "gray.200", _dark: "gray.500" }}
                      placeholder="Registre dúvidas, sugestões ou decisões sobre essa história..."
                      value={newComment}
                      onChange={(e) => {
                        const value = e.target.value.slice(
                          0,
                          MAX_COMMENT_LENGTH
                        );
                        setNewComment(value);
                      }}
                      minH="80px"
                    />
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <HStack gap="2" align="center">
                        <EmojiPickerDialog
                          onSelectEmoji={(emoji) => {
                            setNewComment((prev) =>
                              (prev + emoji).slice(0, MAX_COMMENT_LENGTH)
                            );
                          }}
                        />
                        <Text fontSize="xs" color="gray.500">
                          {newComment.length}/{MAX_COMMENT_LENGTH}
                        </Text>
                      </HStack>
                      <Button
                        size="xs"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        loading={isCreating}
                      >
                        Adicionar comentário
                      </Button>
                    </Box>
                  </Stack>
                  <Stack
                    gap="2"
                    maxH="200px"
                    overflowY="auto"
                    borderTopWidth="1px"
                    borderColor={{ base: "gray.200", _dark: "gray.700" }}
                    pt="2"
                  >
                    {isLoadingComments ? (
                      <Text fontSize="xs" color="gray.500">
                        Carregando comentários...
                      </Text>
                    ) : comments.length === 0 ? (
                      <Text fontSize="xs" color="gray.500">
                        Nenhum comentário ainda. Comece registrando as decisões
                        que você está tomando ao refinar essa história.
                      </Text>
                    ) : (
                      comments.map((comment) => (
                        <Box
                          key={comment.id}
                          p="2"
                          borderRadius="md"
                          bg={{ base: "gray.50", _dark: "gray.900" }}
                          borderWidth="1px"
                          borderColor={{
                            base: "gray.200",
                            _dark: "gray.700",
                          }}
                        >
                          <HStack align="flex-start" gap="4">
                            <Avatar.Root size="sm">
                              <Avatar.Fallback
                                name={user?.fullName || "Autor"}
                              />
                              <Avatar.Image src={comment.avatar || undefined} />
                            </Avatar.Root>
                            <Box flex="1">
                              <HStack
                                justify="space-between"
                                align="center"
                                mb="1"
                              >
                                <Text fontSize="xs" color="gray.500">
                                  {comment.context || "Comentário"} •{" "}
                                  {new Date(
                                    comment.created_at
                                  ).toLocaleString()}
                                </Text>

                                <IconButton
                                  title="Excluir comentário"
                                  size="xs"
                                  variant="ghost"
                                  aria-label="Excluir comentário"
                                  onClick={() => deleteComment(comment.id)}
                                >
                                  <Trash size={12} color="#EF4444" />
                                </IconButton>
                              </HStack>
                              <Text fontSize="sm">{comment.message}</Text>
                            </Box>
                          </HStack>
                        </Box>
                      ))
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
