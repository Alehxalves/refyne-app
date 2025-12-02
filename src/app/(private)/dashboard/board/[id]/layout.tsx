"use client";

import UpdateBoard from "@/components/dashboard/board/UpdateBoard";
import { NavBar } from "@/components/nav-bar";
import { useBoard } from "@/hooks/useBoards";
import { Flex, useDisclosure } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const params = useParams();
  const { board, refetch } = useBoard(params.id as string);
  const { isLoaded, isSignedIn } = useUser();

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
      <UpdateBoard isOpen={open} onClose={onClose} shouldRefetch={refetch} />
      <Flex>{children}</Flex>
    </>
  );
}
