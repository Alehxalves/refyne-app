import { useStory } from "@/hooks/useStories";
import { Menu, Portal } from "@chakra-ui/react";
import { Archive, Ellipsis, Trash } from "lucide-react";
import React from "react";

interface StorySettingsProps {
  storyId: string;
  shouldRefetch?: (value: boolean) => void;
}

export default function StorySettings({
  storyId,
  shouldRefetch,
}: StorySettingsProps) {
  const { archiveStory, deleteStory } = useStory(storyId);

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Ellipsis cursor="pointer" size="18" />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
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
              <Archive size="14" color="#18181B" />
              Arquivar
            </Menu.Item>
            <Menu.Item
              value="delete-story"
              onClick={async (e) => {
                e.stopPropagation();

                try {
                  if (storyId) {
                    await deleteStory();
                    shouldRefetch?.(true);
                  }
                } catch (error) {
                  console.error("Erro ao deletar a história:", error);
                }
              }}
            >
              <Trash size="14" color="#EF4444" />
              Deletar
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
