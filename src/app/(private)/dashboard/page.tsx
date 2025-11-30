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
} from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import {
  Grid3x3,
  Kanban,
  List,
  Plus,
  SquareActivity,
  SquareKanban,
} from "lucide-react";
import React, { useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lottie/loading1.json";
import errorAnimation from "@/assets/lottie/empty-face.json";
import { LuSearch } from "react-icons/lu";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DashboardPage() {
  const { user } = useUser();
  const { boards, createBoard, isLoading, error } = useBoards();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleCreateBoard = async () => {
    await createBoard({
      title: "Novo Quadro",
      description: "Descrição do quadro",
    });
  };

  return (
    <>
      <NavBar />
      <Container px="4" py="4" spaceY="10">
        <VStack align="left" gap="0">
          <Text
            fontWeight="bold"
            fontSize={{ base: "md", sm: "lg", lg: "2xl" }}
            mb="2"
          >
            Boas vindas,{" "}
            {user?.firstName ?? user?.emailAddresses[0].emailAddress}! 👋
          </Text>
          <Text
            fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
            color={{ base: "gray.600", _dark: "gray.400" }}
          >
            Crie quadros, refine histórias com o checklist INVEST e priorize o
            que realmente importa usando MoSCoW, CSD e GUT.
          </Text>
          <Text
            fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
            color={{ base: "gray.600", _dark: "gray.400" }}
          >
            Comece selecionando um quadro ou crie um novo para iniciar. 🚀
          </Text>
        </VStack>
        {isLoading ? (
          <Box mt="10" width={32} height={32} justifySelf="center">
            <Lottie animationData={loadingAnimation} loop={true} />
          </Box>
        ) : error ? (
          <VStack w="100%">
            <Box mt="10" width={32} justifySelf="center">
              <Lottie animationData={errorAnimation} loop={true} />
            </Box>
            <Box w="100%" justifyItems="center">
              <Text
                fontWeight="medium"
                fontSize={{ base: "sm", sm: "md", lg: "md" }}
                color={{ base: "gray.600", _dark: "gray.400" }}
              >
                Ocorreu um erro ao carregar seus quadros!
              </Text>
              <Text
                fontSize={{ base: "sm", sm: "xs", lg: "xs" }}
                color={{ base: "gray.600", _dark: "gray.400" }}
              >
                {error}
              </Text>
            </Box>
          </VStack>
        ) : (
          <VStack align="flex-start" gap="6">
            <Grid
              templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
              gap="6"
            >
              <GridItem colSpan={2}>
                <Card.Root
                  width="250px"
                  variant="elevated"
                  borderRadius="lg"
                  size={{ base: "sm", md: "md" }}
                >
                  <Card.Body
                    gap="2"
                    borderRadius="lg"
                    bg={{ base: "gray.50", _dark: "gray.900" }}
                  >
                    <Card.Title
                      fontWeight="bold"
                      fontSize={{ base: "sm", sm: "md", lg: "md" }}
                      color={{ base: "gray.900", _dark: "gray.50" }}
                    >
                      Total de Quadros
                    </Card.Title>
                    <Card.Description
                      fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                      color={{ base: "gray.600", _dark: "gray.400" }}
                      fontWeight="medium"
                    >
                      <HStack justify="space-between">
                        <Text>{boards?.length ?? 0}</Text>
                        <Box p="1" bg="purple.500" borderRadius="lg">
                          <SquareKanban color="white" />
                        </Box>
                      </HStack>
                    </Card.Description>
                  </Card.Body>
                </Card.Root>
              </GridItem>
              <GridItem colSpan={2}>
                <Card.Root
                  width="250px"
                  variant="elevated"
                  borderRadius="lg"
                  size={{ base: "sm", md: "md" }}
                >
                  <Card.Body
                    gap="2"
                    borderRadius="lg"
                    bg={{ base: "gray.50", _dark: "gray.900" }}
                  >
                    <Card.Title
                      fontWeight="bold"
                      fontSize={{ base: "sm", sm: "md", lg: "md" }}
                      color={{ base: "gray.900", _dark: "gray.50" }}
                    >
                      Atividade Recente
                    </Card.Title>
                    <Card.Description
                      fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                      color={{ base: "gray.600", _dark: "gray.400" }}
                      fontWeight="medium"
                    >
                      <HStack justify="space-between">
                        <Text>
                          {
                            boards.filter((b) => {
                              const updatedAt = new Date(b.updated_at);
                              const sevenDaysAgo = new Date();
                              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                              return updatedAt >= sevenDaysAgo;
                            }).length
                          }
                        </Text>
                        <Box p="1" bg="purple.500" borderRadius="lg">
                          <SquareActivity color="white" />
                        </Box>
                      </HStack>
                    </Card.Description>
                  </Card.Body>
                </Card.Root>
              </GridItem>
            </Grid>
            <Separator w="100%" borderColor="gray.300" />
            <VStack w="100%">
              <VStack alignItems="flex-start" w="100%" mb="6">
                <Text
                  fontWeight="bold"
                  fontSize={{ base: "md", sm: "lg", lg: "2xl" }}
                  color={{ base: "gray.900", _dark: "gray.50" }}
                >
                  Seus Quadros
                </Text>
                <Text
                  fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                  color={{ base: "gray.600", _dark: "gray.400" }}
                  fontWeight="medium"
                >
                  Gerencie seus quadros de forma eficiente
                </Text>
                <Button
                  mt="4"
                  mb="4"
                  bg={{ base: "gray.900", _dark: "gray.200" }}
                  size={{ base: "xs", sm: "sm", lg: "sm" }}
                  onClick={handleCreateBoard}
                  disabled={isLoading}
                >
                  <Plus />
                  Criar novo quadro
                </Button>
                <HStack
                  gap="2"
                  p="2"
                  w="100%"
                  borderRadius="lg"
                  bg={{ base: "gray.50", _dark: "gray.900" }}
                >
                  <Button
                    size={{ base: "xs", sm: "sm", lg: "sm" }}
                    variant={viewMode === "grid" ? "solid" : "ghost"}
                    onClick={() => setViewMode("grid")}
                    p="0"
                  >
                    <Grid3x3 />
                  </Button>
                  <Button
                    size={{ base: "xs", sm: "sm", lg: "sm" }}
                    variant={viewMode === "list" ? "solid" : "ghost"}
                    onClick={() => setViewMode("list")}
                    p="0"
                  >
                    <List />
                  </Button>
                </HStack>
                {/* <Button
                  bg={{ base: "gray.900", _dark: "gray.200" }}
                  size={{ base: "xs", sm: "sm", lg: "sm" }}
                  p="0"
                  w="100%"
                >
                  <Filter />
                  Filtro
                </Button> */}

                <InputGroup flex="1" startElement={<LuSearch />}>
                  <Input
                    placeholder="Buscar quadros..."
                    borderColor={{ base: "gray.400", _dark: "gray.500" }}
                  />
                </InputGroup>
              </VStack>
              <Box>
                {!isLoading && boards.length === 0 ? (
                  <Text>Você não possui quadros</Text>
                ) : (
                  <Grid
                    w="100%"
                    templateColumns={
                      viewMode === "grid"
                        ? {
                            base: "repeat(1, 0fr)",
                            sm: "repeat(2, 0fr)",
                            md: "repeat(3, 0fr)",
                            lg: "repeat(4, 0fr)",
                          }
                        : {}
                    }
                    gap="4"
                    gapX={4}
                  >
                    {boards.map((board) => (
                      <Link
                        key={board.id}
                        href={`/dashboard/board/${board.id}/backlog`}
                      >
                        <GridItem>
                          <Card.Root
                            minW={
                              viewMode === "grid"
                                ? { base: "150px", md: "250px", lg: "275px" }
                                : { base: "300px", md: "300px", lg: "500px" }
                            }
                            variant="elevated"
                            borderRadius="lg"
                            size={{ base: "sm", md: "md" }}
                          >
                            <Card.Body
                              gap="2"
                              cursor="pointer"
                              borderRadius="lg"
                              bg={{ base: "gray.50", _dark: "gray.900" }}
                              _hover={{
                                bg: "rgba(0,0,0,0.1)",
                              }}
                            >
                              <HStack align="center">
                                <Kanban
                                  color={board.color}
                                  width={20}
                                  height={20}
                                />
                                <Card.Title
                                  mb="2"
                                  fontWeight="bold"
                                  fontSize={{ base: "sm", sm: "md", lg: "md" }}
                                >
                                  {board.title}
                                </Card.Title>
                              </HStack>
                              <Card.Description
                                fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                                color={{ base: "gray.600", _dark: "gray.400" }}
                                fontWeight="medium"
                              >
                                {board.description}
                              </Card.Description>
                              <VStack alignItems="flex-start" gap="0">
                                <Text
                                  fontWeight="light"
                                  fontSize="sm"
                                  color="gray.500"
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
                                  fontSize="sm"
                                  color="gray.500"
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
                      </Link>
                    ))}
                  </Grid>
                )}
              </Box>
            </VStack>
          </VStack>
        )}
      </Container>
    </>
  );
}
