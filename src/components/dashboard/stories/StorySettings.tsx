import { useColorMode } from "@/components/ui/color-mode";
import ConfirmAction from "@/components/utils/ConfirmAction";
import { useStory } from "@/hooks/useStories";
import { Button, Menu, Portal, useDisclosure } from "@chakra-ui/react";
import { Archive, ArchiveRestore, Ellipsis, Trash } from "lucide-react";
import React from "react";

interface StorySettingsProps {
  storyId: string;
  shouldRefetch?: (value: boolean) => void;
}

export default function StorySettings({
  storyId,
  shouldRefetch,
}: StorySettingsProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const { story, archiveStory, unarchiveStory, deleteStory } =
    useStory(storyId);

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
              {story && story.archived ? (
                <Menu.Item
                  value="unarchive-story"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      if (storyId) {
                        await unarchiveStory();
                        shouldRefetch?.(true);
                      }
                    } catch (error) {
                      console.error("Erro ao desarquivar a história:", error);
                    }
                  }}
                >
                  <ArchiveRestore
                    size="14"
                    color={isDark ? "#FAFAFA" : "#18181B"}
                  />
                  Desarquivar
                </Menu.Item>
              ) : (
                <Menu.Item
                  value="archive-story"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      if (storyId) {
                        await archiveStory();
                        shouldRefetch?.(true);
                      }
                    } catch (error) {
                      console.error("Erro ao arquivar a história:", error);
                    }
                  }}
                >
                  <Archive size="14" color={isDark ? "#FAFAFA" : "#18181B"} />
                  Arquivar
                </Menu.Item>
              )}
              <Menu.Item
                cursor="pointer"
                value="delete-story"
                onClick={async (e) => {
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
        title="Excluir história"
        description="Tem certeza que deseja excluir esta história? Essa ação não poderá ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={async () => {
          if (!storyId) return;
          await deleteStory();
          shouldRefetch?.(true);
        }}
      />
    </>
  );
}
