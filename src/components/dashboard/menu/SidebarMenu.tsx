"use client";

import { Box, Stack, IconButton } from "@chakra-ui/react";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { useParams, usePathname } from "next/navigation";
import { MENU_ITEMS } from "./menu-items";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

interface SidebarMenuProps {
  expanded?: (value: boolean) => void;
}

export function SidebarMenu({ expanded }: SidebarMenuProps) {
  const params = useParams();
  const boardId = params.id as string;
  const path = usePathname();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  function onToggle() {
    setIsExpanded(!isExpanded);
    if (expanded) {
      expanded(!isExpanded);
    }
  }

  return (
    <Box
      bg={{ base: "gray.50", _dark: "gray.900" }}
      h={`calc(100vh - 3.4rem)`}
      boxShadow={{ base: "md", _dark: "none" }}
      w={isExpanded ? "250px" : "70px"}
      minW={isExpanded ? "250px" : "70px"}
      transition="width 0.3s ease-in-out"
      overflow="visible"
      position="fixed"
      bottom="0"
      left="0"
      flexShrink="0"
      display={{ base: "none", lg: "flex" }}
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Box
        position="absolute"
        top="50%"
        transform="translateY(-50%)"
        right="10px"
        zIndex={10}
      >
        <IconButton
          aria-label="Toggle sidebar"
          size="sm"
          borderRadius="full"
          onClick={onToggle}
          bg="blue.500"
        >
          {isExpanded ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </IconButton>
      </Box>

      <Box flex="1" overflow="auto" pt="4" px="2">
        <Stack gap="2">
          {MENU_ITEMS(path, boardId).map((item) => (
            <SidebarMenuItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isExpanded={isExpanded}
              isCurrent={item.isCurrent}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
