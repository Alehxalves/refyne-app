"use client";

import { NavBar } from "@/components/nav-bar";
import { useBoards } from "@/hooks/useBoards";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  Separator,
  Text,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import { Grid3x3, Kanban, List, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lottie/loading1.json";
import errorAnimation from "@/assets/lottie/empty-face.json";
import { LuSearch } from "react-icons/lu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import BoardSettings from "@/components/dashboard/board/BoardSettings";
import { useRouter } from "next/navigation";
import FeedbackFloatingButton from "@/components/feedback/FeedbackFloatingButton";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const {
    boards = [],
    createBoard,
    isLoading,
    isFetching,
    error,
  } = useBoards();

  const isEmpty = !isLoading && !isFetching && boards.length === 0;
  const isInitialLoading = (isLoading || isFetching) && boards.length === 0;

  const firstNameOrEmail =
    user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "por aqui";

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const recentBoardsCount = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return boards.filter((b) => new Date(b.updated_at) >= sevenDaysAgo).length;
  }, [boards]);

  const filteredBoards = useMemo(() => {
    if (!search.trim()) return boards;
    const term = search.toLowerCase();
    return boards.filter(
      (b) =>
        b.title?.toLowerCase().includes(term) ||
        (b.description ?? "").toLowerCase().includes(term)
    );
  }, [boards, search]);

  const handleCreateBoard = async () => {
    await createBoard({
      title: "Novo quadro",
      description: "Descrição do quadro",
    });
  };

  const handleCardNavigate = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    boardId: string
  ) => {
    try {
      const url = `/dashboard/board/${boardId}/backlog`;

      if (e.ctrlKey || e.metaKey) {
        window.open(url, "_blank");
        return;
      }

      router.push(url);
    } catch (error) {
      console.error("Ocorreu um durante a navegação para o board: ", error);
    }
  };

  return (
    <>
      <NavBar />

      <Container pt="6" pb="10" maxW="7xl">
        <HStack justify="space-between" align="flex-start" mb="6">
          <VStack align="flex-start" gap={1}>
            <Text
              fontWeight="semibold"
              fontSize={{ base: "lg", sm: "xl", lg: "2xl" }}
              letterSpacing="-0.02em"
            >
              Boas vindas, {firstNameOrEmail}! 👋
            </Text>
            <Text
              fontSize={{ base: "xs", sm: "sm" }}
              color={{ base: "gray.600", _dark: "gray.400" }}
            >
              Crie quadros, refine histórias com o checklist INVEST e priorize o
              que realmente importa usando MoSCoW, CSD e GUT.
            </Text>
            <Text
              fontSize={{ base: "xs", sm: "sm" }}
              color={{ base: "gray.600", _dark: "gray.400" }}
            >
              Comece selecionando um quadro ou criando um novo. 🚀
            </Text>
          </VStack>
        </HStack>
        {isInitialLoading ? (
          <Box mt="10" width={32} mx="auto">
            <Lottie animationData={loadingAnimation} loop />
          </Box>
        ) : error ? (
          <VStack w="100%" gap={4}>
            <Box mt="6" width={32}>
              <Lottie animationData={errorAnimation} loop />
            </Box>
            <Box textAlign="center">
              <Text
                fontWeight="medium"
                fontSize={{ base: "sm", md: "md" }}
                color={{ base: "gray.700", _dark: "gray.300" }}
              >
                Ocorreu um erro ao carregar seus quadros.
              </Text>
              <Text
                mt="1"
                fontSize={{ base: "xs", md: "xs" }}
                color={{ base: "gray.500", _dark: "gray.500" }}
              >
                {String(error)}
              </Text>
            </Box>
          </VStack>
        ) : (
          <>
            <Grid
              templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
              gap={4}
              mb="8"
            >
              <GridItem colSpan={{ base: 2, md: 2 }}>
                <Card.Root
                  borderRadius="lg"
                  size="sm"
                  bg={{ base: "white", _dark: "gray.900" }}
                  borderWidth="1px"
                  borderColor={{ base: "gray.100", _dark: "gray.800" }}
                >
                  <Card.Body gap="3">
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                      color={{ base: "gray.500", _dark: "gray.500" }}
                    >
                      Total de quadros
                    </Text>
                    <Text
                      fontSize="2xl"
                      fontWeight="semibold"
                      letterSpacing="-0.04em"
                    >
                      {boards.length}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={{ base: "gray.500", _dark: "gray.500" }}
                    >
                      Espaços ativos para refinar e priorizar requisitos.
                    </Text>
                  </Card.Body>
                </Card.Root>
              </GridItem>
              <GridItem colSpan={{ base: 2, md: 2 }}>
                <Card.Root
                  borderRadius="lg"
                  size="sm"
                  bg={{ base: "white", _dark: "gray.900" }}
                  borderWidth="1px"
                  borderColor={{ base: "gray.100", _dark: "gray.800" }}
                >
                  <Card.Body gap="3">
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                      color={{ base: "gray.500", _dark: "gray.500" }}
                    >
                      Atividade recente (7 dias)
                    </Text>
                    <Text
                      fontSize="2xl"
                      fontWeight="semibold"
                      letterSpacing="-0.04em"
                    >
                      {recentBoardsCount}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={{ base: "gray.500", _dark: "gray.500" }}
                    >
                      Quadros atualizados recentemente.
                    </Text>
                  </Card.Body>
                </Card.Root>
              </GridItem>
            </Grid>
            <Separator borderColor={{ base: "gray.100", _dark: "gray.800" }} />
            <VStack align="flex-start" w="100%" mt="6" gap={4}>
              <HStack w="100%" justify="space-between" align="center">
                <VStack align="flex-start" gap={1}>
                  <Text
                    fontWeight="semibold"
                    fontSize={{ base: "md", sm: "lg" }}
                    color={{ base: "gray.900", _dark: "gray.50" }}
                  >
                    Seus quadros
                  </Text>
                  <Text
                    fontSize="xs"
                    color={{ base: "gray.600", _dark: "gray.400" }}
                  >
                    Gerencie espaços de backlog para cada produto ou projeto.
                  </Text>
                </VStack>
                <Button
                  size="xs"
                  borderRadius="full"
                  onClick={handleCreateBoard}
                  disabled={isLoading}
                >
                  <Plus size={14} />
                  Novo quadro
                </Button>
              </HStack>
              <HStack w="100%" gap={3} align="center" justify="space-between">
                <InputGroup flex="1" startElement={<LuSearch />}>
                  <Input
                    placeholder="Buscar quadros por nome ou descrição..."
                    borderRadius="full"
                    borderColor={{ base: "gray.200", _dark: "gray.700" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
                <HStack
                  gap={1}
                  borderRadius="full"
                  px="1"
                  py="0.5"
                  bg={{ base: "gray.50", _dark: "gray.900" }}
                  borderWidth="1px"
                  borderColor={{ base: "gray.200", _dark: "gray.800" }}
                >
                  <IconButton
                    borderRadius="full"
                    aria-label="Visualizar em grade"
                    size="xs"
                    variant={viewMode === "grid" ? "solid" : "ghost"}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 size={14} />
                  </IconButton>
                  <IconButton
                    borderRadius="full"
                    aria-label="Visualizar em lista"
                    size="xs"
                    variant={viewMode === "list" ? "solid" : "ghost"}
                    onClick={() => setViewMode("list")}
                  >
                    <List style={{ borderRadius: "5px" }} size={14} />
                  </IconButton>
                </HStack>
              </HStack>
            </VStack>
            <Separator my="6" />
            {isEmpty ? (
              <Box
                w="100%"
                borderWidth="1px"
                borderStyle="dashed"
                borderRadius="lg"
                p="6"
                textAlign="center"
                bg={{ base: "gray.50", _dark: "gray.900" }}
              >
                <Text fontWeight="medium" mb="2">
                  Você ainda não possui quadros.
                </Text>
                <Text
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                  mb="4"
                >
                  Crie o primeiro quadro para começar a organizar seu backlog,
                  refinar histórias e priorizar requisitos.
                </Text>
                <Button
                  size="sm"
                  onClick={handleCreateBoard}
                  disabled={isLoading}
                >
                  <Plus size={16} />
                  Criar primeiro quadro
                </Button>
              </Box>
            ) : (
              <Box>
                {filteredBoards.length === 0 ? (
                  <Text
                    fontSize="sm"
                    color={{ base: "gray.600", _dark: "gray.400" }}
                  >
                    Nenhum quadro encontrado para “{search}”.
                  </Text>
                ) : (
                  <Grid
                    w="100%"
                    templateColumns={
                      viewMode === "grid"
                        ? {
                            base: "repeat(1, minmax(0, 1fr))",
                            sm: "repeat(2, minmax(0, 1fr))",
                            md: "repeat(3, minmax(0, 1fr))",
                          }
                        : { base: "1fr" }
                    }
                    gap={4}
                  >
                    {filteredBoards.map((board) => (
                      <GridItem key={board.id}>
                        <Card.Root
                          borderRadius="lg"
                          size="sm"
                          borderWidth="1px"
                          borderColor={{
                            base: "gray.100",
                            _dark: "gray.800",
                          }}
                          bg={{ base: "white", _dark: "gray.950" }}
                          _hover={{
                            borderColor: {
                              base: "gray.300",
                              _dark: "gray.600",
                            },
                            transform: "translateY(-1px)",
                            transition: "all 0.15s ease-out",
                          }}
                        >
                          <Card.Body
                            gap="3"
                            cursor="pointer"
                            onClick={(e) => handleCardNavigate(e, board.id)}
                            onAuxClick={(e) => {
                              // Botão do meio do mouse (scroll click)
                              if (e.button === 1) {
                                const url = `/dashboard/board/${board.id}/backlog`;
                                window.open(url, "_blank");
                              }
                            }}
                          >
                            <HStack
                              justify="space-between"
                              gap={3}
                              mb="1"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <HStack>
                                <Box
                                  w="8"
                                  h="8"
                                  borderRadius="lg"
                                  bg={board.color || "purple.500"}
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Kanban color="white" size={18} />
                                </Box>
                                <VStack align="flex-start" gap={0} minW={0}>
                                  <Text
                                    maxW="200px"
                                    lineClamp={1}
                                    fontWeight="medium"
                                    fontSize="sm"
                                  >
                                    {board.title}
                                  </Text>
                                  {board.description && (
                                    <Text
                                      maxW="200px"
                                      lineClamp={1}
                                      fontSize="xs"
                                      color={{
                                        base: "gray.600",
                                        _dark: "gray.300",
                                      }}
                                    >
                                      {board.description}
                                    </Text>
                                  )}
                                </VStack>
                              </HStack>
                              <BoardSettings boardId={board.id} />
                            </HStack>
                            <VStack alignItems="flex-start" gap={0} mt="2">
                              <Text
                                fontWeight="light"
                                fontSize="xs"
                                color={{ base: "gray.500", _dark: "gray.400" }}
                              >
                                Criado em{" "}
                                {format(
                                  new Date(board.created_at),
                                  "dd/MM/yyyy HH:mm",
                                  { locale: ptBR }
                                )}
                              </Text>
                              <Text
                                fontWeight="light"
                                fontSize="xs"
                                color={{ base: "gray.500", _dark: "gray.400" }}
                              >
                                Atualizado em{" "}
                                {format(
                                  new Date(board.updated_at),
                                  "dd/MM/yyyy HH:mm",
                                  { locale: ptBR }
                                )}
                              </Text>
                            </VStack>
                          </Card.Body>
                        </Card.Root>
                      </GridItem>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </>
        )}
      </Container>
      <FeedbackFloatingButton />
    </>
  );
}
