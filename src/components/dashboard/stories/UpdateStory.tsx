"use client";

import {
  Box,
  Button,
  CloseButton,
  Collapsible,
  Dialog,
  Field,
  HStack,
  Input,
  Portal,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Lightbulb } from "lucide-react";
import { useStory } from "@/hooks/useStories";

const StorySchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
});

type StoryValues = z.infer<typeof StorySchema>;

interface UpdateStoryProps {
  storyId: string;
  isOpen: boolean;
  onClose: () => void;
  shouldRefetch?: (value: boolean) => void;
}

export default function UpdateStory({
  storyId,
  isOpen,
  onClose,
  shouldRefetch,
}: UpdateStoryProps) {
  const { story, updateStory, isLoading: isLoadingStory } = useStory(storyId);

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

  if (isLoadingStory) {
    return null;
  }

  const onSubmit = handleSubmit(async function handleSend(data: StoryValues) {
    try {
      await updateStory({ title: data.title, description: data.description });
      shouldRefetch?.(true);
      onClose();
    } catch (error) {
      console.error("Erro ao criar história:", error);
    }
  });

  return (
    <Dialog.Root
      size="lg"
      open={isOpen === true}
      onOpenChange={() => {
        clearErrors();
        onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header flexDir="column">
              <Dialog.Title>Atualizar História de Usuário</Dialog.Title>
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
                        <Input
                          borderColor={{ base: "gray.200", _dark: "gray.500" }}
                          placeholder="Insira o título da história de usuário aqui... (ex: US.1)"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
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
                        />
                      )}
                    />
                    <Field.ErrorText>
                      {errors.description?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  <Collapsible.Root>
                    <Collapsible.Trigger
                      paddingY="3"
                      display="flex"
                      gap="2"
                      alignItems="center"
                    >
                      <Collapsible.Indicator cursor="pointer">
                        <HStack>
                          <Lightbulb color="#EAB308" />
                          <Text fontSize="sm" fontWeight="medium">
                            Dica rápida: escreva histórias de usuário de forma
                            clara
                          </Text>
                        </HStack>
                      </Collapsible.Indicator>
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                      <Box
                        w="100%"
                        bg="gray.50"
                        _dark={{ bg: "gray.800" }}
                        border="1px solid"
                        borderColor={{ base: "gray.200", _dark: "gray.700" }}
                        borderRadius="md"
                        p="3"
                        fontSize="sm"
                      >
                        <Text fontWeight="medium" mb="1">
                          Use o formato abaixo para explicar quem precisa, o que
                          deseja e por quê:
                        </Text>
                        <Text color="gray.700" _dark={{ color: "gray.300" }}>
                          Utilize o formato:
                        </Text>
                        <Box
                          mt="2"
                          p="2"
                          bg="white"
                          _dark={{ bg: "gray.900" }}
                          borderRadius="md"
                          border="1px dashed"
                          borderColor={{ base: "gray.300", _dark: "gray.600" }}
                          fontFamily="mono"
                          fontSize="sm"
                        >
                          Como <b>[persona]</b>, eu <b>[quero]</b> <i>[algo]</i>{" "}
                          para <b>[alcançar um objetivo]</b>.
                        </Box>
                        <Text
                          mt="2"
                          color="gray.600"
                          _dark={{ color: "gray.400" }}
                        >
                          Exemplo:<b> Como</b> professor, eu <b>quero</b>{" "}
                          registrar as notas dos alunos <b>para</b> acompanhar o
                          desempenho da turma.
                        </Text>
                      </Box>
                    </Collapsible.Content>
                  </Collapsible.Root>
                </Stack>
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  size="sm"
                  type="submit"
                  loading={isLoadingStory}
                  disabled={isLoadingStory}
                >
                  Atualizar história
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
