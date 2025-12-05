"use client";

import { ORDER_BY_STORIES } from "@/lib/supabase/enums";
import { StoryGroup } from "@/lib/supabase/models";
import { Button, Menu, Portal, Text } from "@chakra-ui/react";
import { ArrowUpDown, ListFilter } from "lucide-react";
import React from "react";

interface StoryGroupFilterProps {
  group: StoryGroup;
  onChangeOrder?: (order: ORDER_BY_STORIES) => Promise<void> | void;
  onChangeOrderDirection?: () => void;
}

const LABELS: Record<ORDER_BY_STORIES, string> = {
  CUSTOM: "Ordem manual",
  PRIORITY: "Prioridade",
  STORY_POINTS: "Pontos da história",
  CREATED_AT: "Data de criação",
  UPDATED_AT: "Última atualização",
};

export default function StoryGroupFilter({
  group,
  onChangeOrder,
  onChangeOrderDirection,
}: StoryGroupFilterProps) {
  const currentOrder = (group.order_by_stories as ORDER_BY_STORIES) ?? "CUSTOM";

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          title="Filtrar"
          variant="ghost"
          p="2"
          borderRadius="full"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ListFilter size={14} />
          <Text
            fontSize="xs"
            display={{
              base: "none",
              md: "inline-block",
              lg: "inline-block",
            }}
          >
            {LABELS[currentOrder]}
          </Text>
        </Button>
      </Menu.Trigger>
      <Button
        title="Ordenar"
        variant="ghost"
        p="2"
        borderRadius="full"
        onClick={(e) => {
          e.stopPropagation();
          onChangeOrderDirection?.();
        }}
      >
        <ArrowUpDown size={14} />
      </Button>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {(Object.keys(LABELS) as ORDER_BY_STORIES[]).map((value) => {
              const isActive = currentOrder === value;

              return (
                <Menu.Item
                  cursor="pointer"
                  key={value}
                  value={value}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (value !== currentOrder) {
                      await onChangeOrder?.(value);
                    }
                  }}
                  bg={
                    isActive
                      ? { base: "blue.100", _dark: "blue.500" }
                      : "transparent"
                  }
                  _hover={
                    isActive
                      ? undefined
                      : { bg: { base: "gray.200", _dark: "gray.800" } }
                  }
                >
                  {LABELS[value]}
                </Menu.Item>
              );
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
