"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Link,
  Separator,
  Skeleton,
  SkeletonCircle,
  Spinner,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Image from "next/image";
import refyneLogo from "@/assets/refyne-logo.png";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, MoveRight, SquareKanban, SquarePen } from "lucide-react";
import { useState } from "react";

import UserMenu from "../clerk/UserMenu";
import SignIn from "../clerk/SignIn";

interface NavBarProps {
  boardTitle?: string;
  boardColor?: string;
  onEditBoard?: () => void;
}

export function NavBar({ boardTitle, boardColor, onEditBoard }: NavBarProps) {
  const { isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  const [isMobile] = useMediaQuery(["(max-width: 768px)"]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const isDashboardPage = pathname === "/dashboard";
  const isBoardPage = pathname.startsWith("/dashboard/board/");
  const isBacklogPage = pathname.endsWith("backlog");
  const isArchivedPage = pathname.endsWith("arquivados");

  const params = useParams();
  const boardId = params.id as string;

  const handleGoToDash = () => {
    setIsNavigating(true);
    router.push("/dashboard");
  };

  const handleGoToHome = () => {
    setIsNavigating(true);
    router.push("/");
  };

  const handleSignOut = async () => {
    try {
      setIsLeaving(true);
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("Erro ao deslogar: ", error);
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="banner"
      borderBottomWidth="1px"
      borderColor={{ base: "gray.100", _dark: "gray.800" }}
      bg={{ base: "gray.50", _dark: "gray.900" }}
    >
      <Container maxW="8xl" px={{ base: 3, md: 4 }} h="16">
        <Flex w="100%" h="100%" align="center" justify="space-between">
          <HStack gap={4} align="center">
            <HStack
              gap={2}
              cursor="pointer"
              onClick={handleGoToHome}
              ml={isMobile ? 0 : -5}
            >
              <Image
                width={28}
                height={28}
                alt="Logo Refyne"
                src={refyneLogo}
              />
              {!isMobile && (
                <Text
                  fontWeight="semibold"
                  fontSize={{ base: "sm", md: "md" }}
                  letterSpacing="-0.02em"
                >
                  Refyne
                </Text>
              )}
            </HStack>
            {(isDashboardPage || isBoardPage) && (
              <Separator
                orientation="vertical"
                h="6"
                borderColor={{ base: "gray.200", _dark: "gray.700" }}
              />
            )}
            {isDashboardPage && (
              <HStack gap={2}>
                <SquareKanban size={16} />
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={{ base: "gray.700", _dark: "gray.200" }}
                >
                  Meus boards
                </Text>
              </HStack>
            )}
            {isBoardPage && (
              <HStack
                gap={2}
                maxW={{ base: "65vw", md: "30vw" }}
                flexShrink={1}
                overflow="hidden"
              >
                {!isMobile && (
                  <>
                    <Link
                      href="/dashboard"
                      fontSize="xs"
                      color={{ base: "gray.600", _dark: "gray.400" }}
                      display="inline-flex"
                      alignItems="center"
                      gap={1}
                    >
                      <SquareKanban size={14} />
                      <Text>Boards</Text>
                    </Link>
                    <Text fontSize="xs" color="gray.400">
                      /
                    </Text>
                  </>
                )}

                {/* bloco do board */}
                <HStack gap={2} overflow="hidden" flex="1" minW={0}>
                  <Link
                    href={
                      isBacklogPage
                        ? undefined
                        : `/dashboard/board/${boardId}/backlog`
                    }
                    style={{ flexGrow: 1 }}
                    className="chakra-link"
                  >
                    <HStack gap={2} overflow="hidden" flex="1" minW={0}>
                      <Box
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg={boardColor}
                        flexShrink={0}
                      />
                      {boardTitle ? (
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color={{ base: "gray.800", _dark: "gray.100" }}
                          truncate
                          lineClamp={1}
                          minW={0}
                        >
                          {boardTitle}
                        </Text>
                      ) : (
                        <Skeleton height="3" width="120px" />
                      )}
                    </HStack>
                  </Link>

                  {boardTitle && onEditBoard && (
                    <IconButton
                      title="Editar"
                      aria-label="edit-board"
                      variant="ghost"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();

                        e.preventDefault();
                        onEditBoard();
                      }}
                      flexShrink={0}
                    >
                      <SquarePen size={14} />
                    </IconButton>
                  )}
                </HStack>

                <Text fontSize="xs" color="gray.400">
                  /
                </Text>
                <Link
                  fontSize="xs"
                  href={
                    isArchivedPage
                      ? undefined
                      : `/dashboard/board/${boardId}/arquivados`
                  }
                >
                  Arquivados
                </Link>
              </HStack>
            )}
          </HStack>
          {!isLoaded ? (
            <Stack direction="row" align="center" gap={2}>
              <SkeletonCircle size="8" />
              {!isMobile && <Skeleton height="3" w="80px" />}
            </Stack>
          ) : isSignedIn ? (
            isDashboardPage || isBoardPage ? (
              <UserMenu />
            ) : (
              <HStack gap={2}>
                <Button
                  size="xs"
                  fontSize="xs"
                  borderRadius="full"
                  variant="solid"
                  onClick={handleGoToDash}
                  disabled={isNavigating || isLeaving}
                >
                  {isNavigating ? (
                    <Spinner size="xs" />
                  ) : (
                    <MoveRight size={14} style={{ marginRight: 2 }} />
                  )}
                  Dashboard
                </Button>
                <IconButton
                  borderRadius="full"
                  aria-label="Sair"
                  size="xs"
                  variant="ghost"
                  onClick={handleSignOut}
                  disabled={isNavigating || isLeaving}
                >
                  {isLeaving ? <Spinner size="xs" /> : <LogOut size={16} />}
                </IconButton>
              </HStack>
            )
          ) : (
            <SignIn />
          )}
        </Flex>
      </Container>
    </Box>
  );
}
