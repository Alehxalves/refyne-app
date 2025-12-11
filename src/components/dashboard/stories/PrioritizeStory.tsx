"use client";

import {
  Text,
  Stack,
  RadioGroup,
  HStack,
  NumberInput,
  Textarea,
  Field,
  Dialog,
  Portal,
  CloseButton,
  VStack,
  Checkbox,
  Separator,
  Box,
  Button,
  IconButton,
  Avatar,
} from "@chakra-ui/react";
import { MOSCOW_LEVEL, CSD_LEVEL } from "@/lib/supabase/enums";
import { usePriorizationTechnique } from "@/hooks/usePriorizationTechnique";
import type { CheckboxCheckedChangeDetails } from "@chakra-ui/react";
import { csdTip, gutTip, moscowTip } from "./tips/priorization-tips";
import { useState } from "react";
import { EmojiPickerDialog } from "@/components/utils/EmojiPickerDialog";
import { useJustificationsForPriorization } from "@/hooks/useJustificationsForPriorization";
import { useUser } from "@clerk/nextjs";
import { Trash } from "lucide-react";

interface PrioritizeStoryDialogProps {
  storyId: string;
  isOpen: boolean;
  onClose: () => void;
  shouldRefetch?: (value: boolean) => void;
}

const MAX_REASON_LENGTH = 255;

export function PrioritizeStory({
  storyId,
  isOpen,
  onClose,
  shouldRefetch,
}: PrioritizeStoryDialogProps) {
  const { user } = useUser();
  const { priority, updatePriority, error } = usePriorizationTechnique(storyId);

  const {
    justifications,
    isLoading: isLoadingJustifications,
    isCreating,
    createJustification,
    deleteJustification,
  } = useJustificationsForPriorization(priority?.id ?? "");

  const [newReason, setNewReason] = useState("");

  async function handleAddReason() {
    const trimmed = newReason.trim();
    if (!trimmed || !priority?.id) return;

    try {
      await createJustification({
        priorization_technique_id: priority?.id ?? "",
        avatar: user?.imageUrl || undefined,
        message: trimmed,
      });
      setNewReason("");
    } catch (err) {
      console.error("Erro ao criar justificativa:", err);
    }
  }

  const moscow_items = [
    { label: "Deve ter", value: "MUST", title: "Must Have", bg: "blue.500" },
    {
      label: "Deveria ter",
      value: "SHOULD",
      title: "Should Have",
      bg: "green.500",
    },
    {
      label: "Poderia ter",
      value: "COULD",
      title: "Could Have",
      bg: "orange.500",
    },
    { label: "Não terá", value: "WONT", title: "Won't Have", bg: "red.500" },
  ];

  const csd_items = [
    { label: "Certeza", value: "CERTAINTIES", bg: "blue.500" },
    { label: "Suposição", value: "SUPPOSITIONS", bg: "green.500" },
    { label: "Dúvida", value: "DOUBTS", bg: "orange.500" },
  ];

  const useMoscow = priority?.useMoscow ?? true;
  const useCsd = priority?.useCsd ?? false;
  const useGut = priority?.useGut ?? false;

  const gutScore =
    (priority?.gut_g_value ?? 1) *
    (priority?.gut_u_value ?? 1) *
    (priority?.gut_t_value ?? 1);

  return (
    <Dialog.Root
      size={{ base: "sm", md: "lg", lg: "xl" }}
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) {
          shouldRefetch?.(true);
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
                Priorização da História
              </Dialog.Title>
              {error && (
                <Text fontSize="xs" color="red.500" mt="1">
                  {String(error)}
                </Text>
              )}
            </Dialog.Header>

            <Dialog.Body>
              <Stack spaceY="4">
                <Text
                  fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                  fontWeight="bold"
                >
                  Técnicas de priorização ativas
                </Text>
                <HStack gap="4" flexWrap="wrap">
                  <Checkbox.Root
                    key="useMoscow"
                    checked={useMoscow}
                    onCheckedChange={(details: CheckboxCheckedChangeDetails) =>
                      updatePriority({
                        useMoscow: details.checked === true,
                      })
                    }
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control
                      bg={useMoscow ? "green.500" : "transparent"}
                      borderColor={useMoscow ? "transparent" : undefined}
                    >
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label fontSize="sm">MoSCoW</Checkbox.Label>
                  </Checkbox.Root>

                  <Checkbox.Root
                    key="useCsd"
                    checked={useCsd}
                    onCheckedChange={(details: CheckboxCheckedChangeDetails) =>
                      updatePriority({
                        useCsd: details.checked === true,
                      })
                    }
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control
                      bg={useCsd ? "green.500" : "transparent"}
                      borderColor={useCsd ? "transparent" : undefined}
                    >
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label fontSize="sm">
                      CSD (Certezas, Suposições, Dúvidas)
                    </Checkbox.Label>
                  </Checkbox.Root>

                  <Checkbox.Root
                    key="useGut"
                    checked={useGut}
                    onCheckedChange={(details: CheckboxCheckedChangeDetails) =>
                      updatePriority({
                        useGut: details.checked === true,
                      })
                    }
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control
                      bg={useGut ? "green.500" : "transparent"}
                      borderColor={useGut ? "transparent" : undefined}
                    >
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label fontSize="sm">
                      GUT (Gravidade, Urgência, Tendência)
                    </Checkbox.Label>
                  </Checkbox.Root>
                </HStack>
                <Text fontSize="xs" mt="1" color="gray.500">
                  Use essas opções para ligar ou desligar as técnicas que fazem
                  sentido para essa história.
                </Text>
                <Separator w="100%" />

                {useMoscow && (
                  <>
                    <Field.Root gap="4">
                      <Field.Label
                        fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                        fontWeight="bold"
                      >
                        MoSCoW: Deve ter, Deveria ter, Poderia ter, Não terá
                      </Field.Label>
                      <RadioGroup.Root
                        value={priority?.moscow ?? ""}
                        onValueChange={({ value }) =>
                          updatePriority({ moscow: value as MOSCOW_LEVEL })
                        }
                      >
                        <HStack gap="6" flexWrap="wrap">
                          {moscow_items.map((item) => (
                            <RadioGroup.Item
                              key={item.value}
                              value={item.value}
                            >
                              <RadioGroup.ItemHiddenInput />
                              <RadioGroup.ItemIndicator
                                bg={
                                  item.value === priority?.moscow
                                    ? item.bg
                                    : undefined
                                }
                              />
                              <RadioGroup.ItemText title={item.title}>
                                {item.label}
                              </RadioGroup.ItemText>
                            </RadioGroup.Item>
                          ))}
                        </HStack>
                      </RadioGroup.Root>
                    </Field.Root>
                    {moscowTip()}
                    <Separator w="100%" />
                  </>
                )}

                {useCsd && (
                  <>
                    <Field.Root gap="4">
                      <Field.Label
                        fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                        fontWeight="bold"
                      >
                        CSD: Certezas, Suposições, Dúvidas
                      </Field.Label>
                      <RadioGroup.Root
                        value={priority?.csd ?? ""}
                        onValueChange={({ value }) =>
                          updatePriority({ csd: value as CSD_LEVEL })
                        }
                      >
                        <HStack gap="6" flexWrap="wrap">
                          {csd_items.map((item) => (
                            <RadioGroup.Item
                              key={item.value}
                              value={item.value}
                            >
                              <RadioGroup.ItemHiddenInput />
                              <RadioGroup.ItemIndicator
                                bg={
                                  item.value === priority?.csd
                                    ? item.bg
                                    : undefined
                                }
                              />
                              <RadioGroup.ItemText>
                                {item.label}
                              </RadioGroup.ItemText>
                            </RadioGroup.Item>
                          ))}
                        </HStack>
                      </RadioGroup.Root>
                    </Field.Root>
                    {csdTip()}
                    <Separator w="100%" />
                  </>
                )}

                {useGut && (
                  <>
                    <Field.Root>
                      <Field.Label
                        fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                        fontWeight="bold"
                      >
                        GUT: Gravidade, Urgência, Tendência (1 a 5)
                      </Field.Label>
                    </Field.Root>
                    <HStack gap="3" w="100%">
                      <VStack align="center">
                        <Text>Gravidade</Text>
                        <NumberInput.Root
                          maxW="80px"
                          value={(priority?.gut_g_value ?? 1).toString()}
                          min={1}
                          max={5}
                          onValueChange={({ value }) => {
                            updatePriority({
                              gut_g_value: Number(value) || 1,
                            });
                          }}
                        >
                          <NumberInput.Control />
                          <NumberInput.Input />
                        </NumberInput.Root>
                      </VStack>
                      <VStack alignItems="center">
                        <Text>Urgência</Text>
                        <NumberInput.Root
                          maxW="80px"
                          value={(priority?.gut_u_value ?? 1).toString()}
                          min={1}
                          max={5}
                          onValueChange={({ value }) =>
                            updatePriority({
                              gut_u_value: Number(value) || 1,
                            })
                          }
                        >
                          <NumberInput.Control />
                          <NumberInput.Input />
                        </NumberInput.Root>
                      </VStack>
                      <VStack>
                        <Text>Tendência</Text>
                        <NumberInput.Root
                          maxW="80px"
                          value={(priority?.gut_t_value ?? 1).toString()}
                          min={1}
                          max={5}
                          onValueChange={({ value }) =>
                            updatePriority({
                              gut_t_value: Number(value) || 1,
                            })
                          }
                        >
                          <NumberInput.Control />
                          <NumberInput.Input />
                        </NumberInput.Root>
                      </VStack>
                    </HStack>

                    <Text fontSize="xs" mt="1" color="gray.500">
                      Pontuação final: <b>{gutScore}</b>
                    </Text>
                    {gutTip()}
                  </>
                )}

                <Box w="100%" mt="4">
                  <Text
                    fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                    fontWeight="bold"
                    mb="2"
                  >
                    Justificativas e decisões sobre a priorização
                  </Text>
                  <Stack gap="2" mb="3">
                    <Textarea
                      fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                      borderColor={{ base: "gray.200", _dark: "gray.500" }}
                      placeholder="Registre aqui as decisões que você está tomando ao priorizar essa história..."
                      value={newReason}
                      onChange={(e) => {
                        const value = e.target.value.slice(
                          0,
                          MAX_REASON_LENGTH
                        );
                        setNewReason(value);
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
                          key="prioritize-story-justification-emoji-picker"
                          onSelectEmoji={(emoji) => {
                            setNewReason((prev) =>
                              (prev + emoji).slice(0, MAX_REASON_LENGTH)
                            );
                          }}
                        />
                        <Text fontSize="xs" color="gray.500">
                          {newReason.length}/{MAX_REASON_LENGTH}
                        </Text>
                      </HStack>
                      <Button
                        size="xs"
                        onClick={handleAddReason}
                        disabled={!newReason.trim()}
                        loading={isCreating}
                      >
                        Adicionar justificativa
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
                    {isLoadingJustifications ? (
                      <Text fontSize="xs" color="gray.500">
                        Carregando justificativas...
                      </Text>
                    ) : justifications?.length === 0 ? (
                      <Text fontSize="xs" color="gray.500">
                        Nenhuma justificativa ainda. Adicione uma acima.
                      </Text>
                    ) : (
                      justifications.map((justification) => (
                        <Box
                          key={justification.id}
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
                              <Avatar.Image
                                src={justification.avatar || undefined}
                              />
                            </Avatar.Root>
                            <Box flex="1">
                              <HStack
                                justify="space-between"
                                align="center"
                                mb="1"
                              >
                                <Text fontSize="xs" color="gray.500">
                                  {new Date(
                                    justification.created_at
                                  ).toLocaleString()}
                                </Text>

                                <IconButton
                                  title="Excluir comentário"
                                  size="xs"
                                  variant="ghost"
                                  aria-label="Excluir justificativa"
                                  onClick={() =>
                                    deleteJustification(justification.id)
                                  }
                                >
                                  <Trash size={12} color="#EF4444" />
                                </IconButton>
                              </HStack>
                              <Text fontSize="sm">{justification.message}</Text>
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
              <CloseButton borderRadius="full" size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
