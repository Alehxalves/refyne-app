"use client";

import { useArchivedStories } from "@/hooks/useStories";
import { StoryWithPrioritization } from "@/lib/supabase/models";
import {
  Accordion,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  GridItem,
  HStack,
  Progress,
  Separator,
  Text,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useCheckLists } from "@/hooks/useChecklists";
import StorySettings from "@/components/dashboard/stories/StorySettings";
import { useArchivedStoryGroups } from "@/hooks/useStoryGroups";
import StoryGroupSettings from "@/components/dashboard/stories/story-group/StoryGroupSettings";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lottie/loading1.json";
import { csdLevelsPtBr, moscowLevelsPtBr } from "@/lib/utils";
import { sortStoriesForGroup } from "@/components/utils/helpers";
import { HiStar } from "react-icons/hi";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StoryProps {
  story: StoryWithPrioritization;
  isMobile?: boolean;
  shouldRefetch?: (value: boolean) => void;
}

function StoryList({ story, isMobile, shouldRefetch }: StoryProps) {
  const { checkLists } = useCheckLists(story.id);
  const [isRefined, setIsRefined] = useState(false);

  const prioritization = story.prioritization_technique;
  const storyPoints = story.story_points || 0;

  const moscowLevel =
    moscowLevelsPtBr[prioritization?.moscow as keyof typeof moscowLevelsPtBr];
  const csdLevel =
    csdLevelsPtBr[prioritization?.csd as keyof typeof csdLevelsPtBr];
  const gutScore =
    prioritization?.useGut &&
    prioritization.gut_g_value *
      prioritization.gut_u_value *
      prioritization.gut_t_value;

  const moscowPalette = {
    MUST: "blue",
    SHOULD: "green",
    COULD: "orange",
    WONT: "red",
  };

  const csdPalette = {
    CERTAINTIES: "blue",
    SUPPOSITIONS: "green",
    DOUBTS: "orange",
  };

  const createdAtLabel = React.useMemo(() => {
    if (!story.created_at) return null;

    const date = new Date(story.created_at);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  }, [story.created_at]);

  return (
    <GridItem key={story.id}>
      <Card.Root
        size="sm"
        bg={{ base: "white", _dark: "gray.900" }}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={{ base: "gray.200", _dark: "gray.800" }}
        _hover={{
          borderColor: {
            base: "gray.300",
            _dark: "gray.600",
          },
          transform: "translateY(-1px)",
        }}
        transition="all 0.15s ease-out"
      >
        <Card.Body gap="3">
          <HStack alignItems="flex-start" justify="space-between">
            <VStack align="flex-start" gap="2">
              {isRefined && (
                <Badge
                  color="white"
                  bg="purple.500"
                  variant="subtle"
                  py="0.5"
                  size={isMobile ? "sm" : "md"}
                >
                  <HiStar />
                  Refinada
                </Badge>
              )}

              {prioritization && (
                <HStack gap="2" flexWrap="wrap">
                  {prioritization.useMoscow && (
                    <Badge
                      size={isMobile ? "sm" : "md"}
                      colorPalette={
                        moscowPalette[
                          prioritization.moscow as keyof typeof moscowPalette
                        ]
                      }
                      variant="subtle"
                      py="0.5"
                    >
                      MoSCoW: {moscowLevel}
                    </Badge>
                  )}
                  {prioritization.useCsd && (
                    <Badge
                      size={isMobile ? "sm" : "md"}
                      colorPalette={
                        csdPalette[
                          prioritization.csd as keyof typeof csdPalette
                        ]
                      }
                      variant="subtle"
                      py="0.5"
                    >
                      CSD: {csdLevel}
                    </Badge>
                  )}
                  {prioritization.useGut && (
                    <Badge
                      size={isMobile ? "sm" : "md"}
                      colorPalette="pink"
                      variant="subtle"
                      py="0.5"
                    >
                      GUT: {gutScore}{" "}
                      {`${
                        !isMobile
                          ? (gutScore as number) > 1
                            ? "pontos"
                            : "ponto"
                          : (gutScore as number) > 1
                          ? "Pts"
                          : "Pt"
                      }`}
                    </Badge>
                  )}
                </HStack>
              )}
              <Card.Title fontSize={{ base: "sm", sm: "md" }}>
                {story.title}
              </Card.Title>
              <Card.Description
                fontSize={{ base: "xs", sm: "sm" }}
                color={{ base: "gray.600", _dark: "gray.300" }}
              >
                {story.description}
              </Card.Description>
            </VStack>
            <StorySettings storyId={story.id} shouldRefetch={shouldRefetch} />
          </HStack>
          <HStack>
            {storyPoints > 0 && (
              <>
                <Text
                  lineClamp={1}
                  fontSize="xs"
                  color={{ base: "gray.500", _dark: "gray.400" }}
                  fontWeight="thin"
                >
                  {storyPoints} {storyPoints === 1 ? "ponto" : "pontos"}
                </Text>
                <Separator
                  display={{ base: "none", md: "block" }}
                  orientation="vertical"
                  h="10px"
                />
              </>
            )}
            {createdAtLabel && (
              <Text
                lineClamp={1}
                fontSize="xs"
                color={{ base: "gray.500", _dark: "gray.400" }}
                display={{ base: "none", md: "block" }}
              >
                Criada em {createdAtLabel}
              </Text>
            )}
          </HStack>
        </Card.Body>

        <Separator />
        <Card.Footer justifyContent="flex-end" gap="2" py="2.5">
          {checkLists && checkLists.length > 0 && (
            <VStack align="flex-start" gap="3" w="100%">
              {checkLists.map((cl) => {
                const totalItems = cl.items.length;
                const completedItems = cl.items.filter(
                  (item) => item.is_checked
                ).length;
                const progress =
                  totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

                if (progress === 100) {
                  if (!isRefined) setIsRefined(true);
                } else if (isRefined) {
                  setIsRefined(false);
                }

                return (
                  <Box key={cl.id}>
                    <Text fontSize="xs" fontWeight="medium">
                      {cl.title}
                    </Text>
                    <HStack gap="4">
                      <Progress.Root value={progress}>
                        <Progress.Track flex="1" minW="150px" maxW="150px">
                          <Progress.Range colorPalette="green" />
                        </Progress.Track>
                      </Progress.Root>
                      <Text fontSize="xs" color="gray.500">
                        {Math.round(progress)}%
                      </Text>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          )}
        </Card.Footer>
      </Card.Root>
    </GridItem>
  );
}

export default function ArchivedPage() {
  const [isMobile] = useMediaQuery(["(max-width: 400px)"]);
  const params = useParams();
  const boardId = params.id as string;

  const { stories, isLoading, error, refetch } = useArchivedStories(boardId);

  const {
    storyGroups,
    isLoading: isLoadingGroups,
    deleteStoryGroup,
    archiveGroup,
    unarchiveGroup,
    refetch: refetchGroups,
  } = useArchivedStoryGroups(boardId);

  const totalStories = stories.length ?? 0;

  const storiesWithoutGroup = useMemo(
    () => stories.filter((s) => !s.story_group_id),
    [stories]
  );

  function storiesByGroupId(groupId: string) {
    return stories.filter((s) => s.story_group_id === groupId);
  }

  const isInitialLoading =
    (isLoading || isLoadingGroups) &&
    stories.length === 0 &&
    storyGroups.length === 0;

  return (
    <Container pt="6" pb="10" maxW="7xl">
      <Box spaceY="8">
        {isInitialLoading ? (
          <VStack mt="16" gap="3">
            <Box mt="10" width={32} mx="auto">
              <Lottie animationData={loadingAnimation} loop />
            </Box>
            <Text fontSize="sm" color="gray.500">
              Carregando arquivados...
            </Text>
          </VStack>
        ) : error ? (
          <VStack mt="16" gap="3">
            <Text fontWeight="medium">Erro ao carregar arquivados.</Text>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                refetch();
                refetchGroups();
              }}
            >
              <RefreshCcw size={16} />
              Tentar novamente
            </Button>
          </VStack>
        ) : (
          <>
            <HStack justify="space-between" align="flex-start">
              <Box>
                <Text
                  fontSize={{ base: "lg", sm: "xl", lg: "2xl" }}
                  fontWeight="semibold"
                  letterSpacing="-0.02em"
                >
                  Histórias e grupos arquivados
                </Text>
                <Text
                  fontSize={{ base: "xs", sm: "sm" }}
                  color={{ base: "gray.600", _dark: "gray.400" }}
                  maxW="680px"
                  mt="1"
                >
                  Aqui estão todas as histórias e grupos de histórias que foram
                  arquivados neste board. Você rrestaurar ou excluir
                  permanentemente qualquer item arquivado conforme necessário.
                </Text>
              </Box>
            </HStack>

            <VStack
              align="flex-start"
              bg={{ base: "gray.50", _dark: "gray.900" }}
              borderRadius="md"
              borderWidth="1px"
              borderColor={{ base: "gray.100", _dark: "gray.800" }}
              px="3"
              py="2.5"
            >
              <Text
                fontSize="xs"
                color={{ base: "gray.700", _dark: "gray.300" }}
              >
                Total de histórias:{" "}
                <Text as="span" fontWeight="semibold">
                  {totalStories}
                </Text>
              </Text>
            </VStack>
            {totalStories === 0 ? (
              <Card.Root
                mt="4"
                borderRadius="lg"
                bg={{ base: "gray.50", _dark: "gray.900" }}
                borderWidth="1px"
                borderColor={{ base: "gray.100", _dark: "gray.800" }}
              >
                <Card.Body textAlign="center" py="10" gap="3">
                  <Text fontWeight="medium">Nada arquivado ainda.</Text>
                  <Text fontSize="sm" color="gray.500">
                    Histórias e grupos arquivados aparecerão aqui. No momento,
                    nenhum item foi enviado para o arquivo.
                  </Text>
                </Card.Body>
              </Card.Root>
            ) : (
              <Accordion.Root
                multiple
                spaceY="4"
                collapsible
                defaultValue={storyGroups.map((g) => g.id)}
              >
                {storyGroups.map((group) => {
                  const groupStories = sortStoriesForGroup(
                    storiesByGroupId(group.id),
                    group
                  );

                  return (
                    <Accordion.Item
                      key={group.id}
                      value={group.id}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor={{ base: "gray.200", _dark: "gray.800" }}
                      bg={{ base: "white", _dark: "gray.900" }}
                    >
                      <Accordion.ItemTrigger
                        px="3"
                        py="2.5"
                        borderBottomWidth="1px"
                        borderColor={{ base: "gray.100", _dark: "gray.800" }}
                        _hover={{
                          bg: { base: "gray.50", _dark: "gray.850" },
                        }}
                      >
                        <HStack justify="space-between" w="100%">
                          <HStack gap="2" alignItems="center">
                            <Box
                              w="10px"
                              h="10px"
                              borderRadius="full"
                              bg={group.color || "purple.500"}
                            />
                            <Text
                              fontSize="sm"
                              fontWeight="semibold"
                              color={{ base: "gray.800", _dark: "gray.100" }}
                            >
                              {group.title}
                            </Text>
                            {!isMobile && (
                              <Text
                                fontSize="sm"
                                color={{
                                  base: "gray.500",
                                  _dark: "gray.500",
                                }}
                              >
                                {groupStories.length} histórias
                              </Text>
                            )}
                          </HStack>
                          <HStack
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            gap="0"
                          >
                            <StoryGroupSettings
                              storyGroupId={group.id}
                              isArchived={group.archived}
                              onDelete={async () => {
                                await deleteStoryGroup(group.id);
                                await refetchGroups();
                                await refetch();
                              }}
                              onArchive={async () => {
                                await archiveGroup(group.id);
                                await refetchGroups();
                              }}
                              onUnarchive={async () => {
                                await unarchiveGroup(group.id);
                                await refetchGroups();
                              }}
                            />
                          </HStack>
                        </HStack>
                      </Accordion.ItemTrigger>
                      <Accordion.ItemContent px="3" py="3">
                        {groupStories.length === 0 ? (
                          <Text
                            fontSize="xs"
                            color={{ base: "gray.500", _dark: "gray.500" }}
                          >
                            Nenhuma história neste grupo.
                          </Text>
                        ) : (
                          <Grid gap="4">
                            {groupStories.map((story) => (
                              <StoryList
                                key={story.id}
                                story={story}
                                isMobile={isMobile}
                                shouldRefetch={() => refetch()}
                              />
                            ))}
                          </Grid>
                        )}
                      </Accordion.ItemContent>
                    </Accordion.Item>
                  );
                })}

                {storiesWithoutGroup.length > 0 && (
                  <Accordion.Item
                    value="no-group"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={{ base: "gray.200", _dark: "gray.800" }}
                    bg={{ base: "white", _dark: "gray.900" }}
                  >
                    <Accordion.ItemTrigger
                      px="3"
                      py="2.5"
                      borderBottomWidth="1px"
                      borderColor={{ base: "gray.100", _dark: "gray.800" }}
                      _hover={{ bg: { base: "gray.50", _dark: "gray.850" } }}
                    >
                      <HStack justify="space-between" w="100%">
                        <HStack>
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color={{ base: "gray.800", _dark: "gray.100" }}
                          >
                            Histórias arquivadas sem grupo
                          </Text>
                          {!isMobile && (
                            <Text
                              fontSize="sm"
                              color={{ base: "gray.500", _dark: "gray.500" }}
                            >
                              {storiesWithoutGroup.length} histórias
                            </Text>
                          )}
                        </HStack>
                      </HStack>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent px="3" py="3">
                      <Grid gap="4">
                        {storiesWithoutGroup.map((story) => (
                          <StoryList
                            key={story.id}
                            story={story}
                            isMobile={isMobile}
                            shouldRefetch={() => refetch()}
                          />
                        ))}
                      </Grid>
                    </Accordion.ItemContent>
                  </Accordion.Item>
                )}
              </Accordion.Root>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}
