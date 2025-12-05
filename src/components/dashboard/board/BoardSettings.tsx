import ConfirmAction from "@/components/utils/ConfirmAction";
import { useBoard } from "@/hooks/useBoards";
import { Button, Menu, Portal, useDisclosure } from "@chakra-ui/react";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import React from "react";
import UpdateBoard from "./UpdateBoard";

interface BoardSettingsProps {
  boardId: string;
  shouldRefetch?: (value: boolean) => void;
}

export default function BoardSettings({
  boardId,
  shouldRefetch,
}: BoardSettingsProps) {
  const { deleteBoard } = useBoard(boardId);

  const {
    open: isUpdateOpen,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate,
  } = useDisclosure();
  const {
    open: isConfirmDeleteOpen,
    onOpen: onOpenConfirmDelete,
    onClose: onCloseConfirmDelete,
  } = useDisclosure();

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
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
                  onOpenUpdate();
                }}
              >
                <Pencil size={14} />
                Editar quadro
              </Menu.Item>
              <Menu.Item
                cursor="pointer"
                value="delete-board"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenConfirmDelete();
                }}
              >
                <Trash size="14" color="#EF4444" />
                Deletar
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <ConfirmAction
        isOpen={isConfirmDeleteOpen}
        onClose={onCloseConfirmDelete}
        title="Excluir quadro"
        description="Tem certeza que deseja excluir este quadro? Essa ação não poderá ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={async () => {
          if (!boardId) return;
          await deleteBoard();
          shouldRefetch?.(true);
        }}
      />
      <UpdateBoard
        isOpen={isUpdateOpen}
        onClose={onCloseUpdate}
        shouldRefetch={shouldRefetch}
        boardId={boardId}
      />
    </>
  );
}
