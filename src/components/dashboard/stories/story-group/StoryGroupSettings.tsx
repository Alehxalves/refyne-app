"use client";

import ConfirmAction from "@/components/utils/ConfirmAction";
import { Button, Menu, Portal, useDisclosure } from "@chakra-ui/react";
import { Ellipsis, Pencil, Trash, ChevronUp, ChevronDown } from "lucide-react";
import React from "react";

interface StoryGroupSettingsProps {
  storyGroupId: string;
  onDelete?: () => Promise<void> | void;
  onEdit?: () => void;
  onMoveUp?: () => Promise<void> | void;
  onMoveDown?: () => Promise<void> | void;
}

export default function StoryGroupSettings({
  storyGroupId,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
}: StoryGroupSettingsProps) {
  const {
    open: isConfirmDeleteOpen,
    onOpen: onOpenConfirmDelete,
    onClose: onCloseConfirmDelete,
  } = useDisclosure();

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild mt="0.5">
          <Button
            variant="ghost"
            p="2"
            borderRadius="full"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Ellipsis cursor="pointer" size="18" />
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                cursor="pointer"
                value="edit-story-group"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
              >
                <Pencil size={14} />
                Editar grupo
              </Menu.Item>
              <Menu.Item
                cursor="pointer"
                value="move-up"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await onMoveUp?.();
                  } catch (error) {
                    console.error(
                      `Erro ao mover grupo ${storyGroupId} para cima:`,
                      error
                    );
                  }
                }}
              >
                <ChevronUp size={14} />
                Mover para cima
              </Menu.Item>
              <Menu.Item
                cursor="pointer"
                value="move-down"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await onMoveDown?.();
                  } catch (error) {
                    console.error(
                      `Erro ao mover grupo ${storyGroupId} para baixo:`,
                      error
                    );
                  }
                }}
              >
                <ChevronDown size={14} />
                Mover para baixo
              </Menu.Item>
              <Menu.Item
                cursor="pointer"
                value="delete-story-group"
                onClick={async (e) => {
                  e.stopPropagation();
                  onOpenConfirmDelete();
                }}
              >
                <Trash size={14} color="#EF4444" />
                Deletar
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <ConfirmAction
        isOpen={isConfirmDeleteOpen}
        onClose={onCloseConfirmDelete}
        title="Excluir grupo de histórias"
        description="Tem certeza que deseja excluir este grupo de histórias? Essa ação não poderá ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={async () => {
          if (!storyGroupId) return;
          await onDelete?.();
        }}
      />
    </>
  );
}
