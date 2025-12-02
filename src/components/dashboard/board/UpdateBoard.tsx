"use client";

import { useBoard } from "@/hooks/useBoards";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Input,
  Portal,
  Text,
  useToken,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface UpdateBoardProps {
  isOpen: boolean;
  onClose: () => void;
  shouldRefetch?: (value: boolean) => void;
}

export default function UpdateBoard({
  isOpen,
  onClose,
  shouldRefetch,
}: UpdateBoardProps) {
  const params = useParams();
  const { board, updateBoard, isLoading } = useBoard(params.id as string);

  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");

  const [isUpdateing, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isOpen && board) {
      setNewTitle(board.title || "");
      setNewColor(board.color || "");
    }
  }, [isOpen, board]);

  const handleUpdateBoard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!board) return;

    setIsUpdating(true);
    try {
      await updateBoard({
        title: newTitle.trim(),
        color: newColor || board.color,
      });
      shouldRefetch?.(true);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar o quadro:", error);
    } finally {
      setIsUpdating(false);
    }
  };

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
    <Dialog.Root key="md" size="lg" open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Editar Quadro</Dialog.Title>
            </Dialog.Header>
            <form onSubmit={handleUpdateBoard}>
              <Dialog.Body>
                <VStack align="left" gap="4">
                  <Box spaceY="2">
                    <Text>Nome do Quadro</Text>
                    <Input
                      name="board_title"
                      w="300px"
                      placeholder="Novo quadro..."
                      borderRadius="lg"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </Box>
                  <Box spaceY="2" spaceX="2">
                    <Text>Cor do Quadro</Text>
                    {colorOptions.map((color) => (
                      <Button
                        name="board_color"
                        borderRadius="full"
                        key={color}
                        bg={color}
                        aria-label={`Selecionar cor ${color}`}
                        onClick={() => setNewColor(color)}
                        borderWidth={color === newColor ? "3px" : "0px"}
                        borderColor={
                          color === newColor ? "gray.800" : "transparent"
                        }
                        _hover={{
                          transform: "scale(1.05)",
                        }}
                      />
                    ))}
                  </Box>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" size="sm">
                    Cancelar
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  size="sm"
                  type="submit"
                  disabled={isUpdateing || isLoading}
                  loading={isUpdateing || isLoading}
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
