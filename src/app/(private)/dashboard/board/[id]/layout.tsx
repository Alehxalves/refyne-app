"use client";

import UpdateBoard from "@/components/dashboard/board/UpdateBoard";
import { SidebarMenu } from "@/components/dashboard/menu/SidebarMenu";
import { NavBar } from "@/components/nav-bar";
import { useBoard } from "@/hooks/useBoards";
import { Box, Flex, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const params = useParams();
  const { board, loadBoard } = useBoard(params.id as string);
  const { isLoaded, isSignedIn } = useUser();

  const [isMobile] = useMediaQuery(["(max-width: 1024px)"]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { open, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <>
      <NavBar
        boardTitle={board?.title}
        boardColor={board?.color}
        onEditBoard={onOpen}
      />
      <UpdateBoard isOpen={open} onClose={onClose} shouldRefetch={loadBoard} />
      <Flex>
        <SidebarMenu expanded={setIsExpanded} />
        <Box
          flex="1"
          ml={
            !isMobile
              ? {
                  base: "0",
                  md: isExpanded ? "250px" : "40px",
                  lg: isExpanded ? "250px" : "40px",
                }
              : "0px"
          }
          transition="margin-left 0.3s ease-in-out"
          height="calc(100vh - 64px)"
          overflowY="auto"
        >
          {children}
        </Box>
      </Flex>
    </>
  );
}
