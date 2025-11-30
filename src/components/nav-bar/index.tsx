"use client";

import {
  Box,
  Button,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  Spinner,
  Stack,
  Text,
  useMediaQuery,
  IconButton,
} from "@chakra-ui/react";
import Image from "next/image";
import refyneLogo from "@/assets/refyne-logo.png";

import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, Menu, MoveRight, SquareKanban, SquarePen } from "lucide-react";
import { useState } from "react";

import { MobileSidebarMenu } from "../dashboard/menu/MobileSidebarMenu";
import { useDisclosure } from "@chakra-ui/react";
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

  const [isMobile] = useMediaQuery(["(max-width: 1024px)"]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const {
    open: isMobileMenuOpen,
    onOpen: onOpenMobileMenu,
    onClose: onCloseMobileMenu,
  } = useDisclosure();

  const isDashboardPage = pathname === "/dashboard";
  const isBoardPage = pathname.startsWith("/dashboard/board/");

  const handleGoToDash = () => {
    setIsNavigating(true);
    router.push("/dashboard");
  };

  const handleGoToHome = () => {
    setIsNavigating(true);
    router.push("/");
  };

  const handleSignOut = async () => {
    setIsLeaving(true);
    await signOut();
  };

  return (
    <>
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex="banner"
        px="4"
        h="16"
        bg={{ base: "gray.50", _dark: "gray.900" }}
        borderBottomWidth="1px"
        borderColor={{ base: "gray.200", _dark: "gray.700" }}
        display="flex"
        alignItems="center"
      >
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <HStack gap={3} align="center">
            {isMobile && (isDashboardPage || isBoardPage) && (
              <IconButton
                aria-label="Abrir menu"
                variant="ghost"
                size="sm"
                onClick={onOpenMobileMenu}
                _hover={{ bg: { base: "gray.100", _dark: "blue.900" } }}
              >
                <Menu size={18} />
              </IconButton>
            )}
            <HStack gap={2} cursor="pointer" onClick={handleGoToHome}>
              <Image width={30} height={30} alt="Logo" src={refyneLogo} />
              {!isMobile && (
                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                  Refyne
                </Text>
              )}
            </HStack>
            {isBoardPage && (
              <>
                <HStack gap={2}>
                  <SquareKanban size={18} color={boardColor ?? "#3B82F6"} />
                  {boardTitle ? (
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      maxW={{ base: "120px", md: "200px" }}
                    >
                      {boardTitle}
                    </Text>
                  ) : (
                    <Skeleton height="4" width="150px" />
                  )}
                  {boardTitle && (
                    <SquarePen
                      cursor="pointer"
                      onClick={onEditBoard}
                      size={18}
                    />
                  )}
                </HStack>
              </>
            )}
          </HStack>

          {!isLoaded ? (
            <Stack maxW="xs" direction="row" align="center">
              <SkeletonCircle size="8" />
              <Skeleton height="3" w="80px" />
            </Stack>
          ) : isSignedIn ? (
            isDashboardPage || isBoardPage ? (
              <UserMenu />
            ) : (
              <HStack gap={2} align="flex-end">
                <Button
                  size="xs"
                  fontSize="xs"
                  onClick={handleGoToDash}
                  disabled={isNavigating || isLeaving}
                >
                  {isNavigating ? (
                    <Spinner size="xs" mr="4" />
                  ) : (
                    <MoveRight style={{ marginRight: 4 }} />
                  )}{" "}
                  Acessar Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleSignOut}
                  disabled={isNavigating || isLeaving}
                >
                  {isLeaving ? <Spinner size="xs" /> : <LogOut />}
                  Sair
                </Button>
              </HStack>
            )
          ) : (
            <SignIn />
          )}
        </Flex>
      </Box>
      {isMobile && (
        <MobileSidebarMenu
          isOpen={isMobileMenuOpen}
          onClose={onCloseMobileMenu}
        />
      )}
    </>
  );
}
