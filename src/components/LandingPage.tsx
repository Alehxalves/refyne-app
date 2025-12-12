import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useUser } from "@clerk/nextjs";
import SignIn from "./clerk/SignIn";
import Image from "next/image";
import refyneLogo from "@/assets/refyne-logo.png";
import { Info } from "lucide-react";
import aiIcon from "@/assets/icons/ai-icon.png";
import refineIcon from "@/assets/icons/refine-icon.png";
import priorityIcon from "@/assets/icons/priority-icon.png";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  function startNow() {
    return isSignedIn ? (
      <Button
        size="sm"
        colorScheme="purple"
        onClick={() => router.push("/dashboard")}
      >
        <Image width={18} height={18} alt="Logo" src={refyneLogo} />
        Começar agora
      </Button>
    ) : (
      <SignIn>
        <Button size="sm" colorScheme="purple">
          <Image width={18} height={18} alt="Logo" src={refyneLogo} />
          Começar agora
        </Button>
      </SignIn>
    );
  }

  return (
    <Box as="main" flex="1">
      <Container maxW="6xl" px={{ base: 4, md: 6 }} py={{ base: 10, md: 16 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} alignItems="center">
          <Stack gap={4}>
            <Badge
              alignSelf="flex-start"
              borderRadius="full"
              px="3"
              py="1"
              fontSize="xs"
              bg={{ base: "purple.100", _dark: "purple.900" }}
              color={{ base: "purple.700", _dark: "purple.200" }}
            >
              Focado em Product Owners & times ágeis
            </Badge>

            <Heading
              as="h1"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              lineHeight="short"
            >
              Refine suas histórias de usuário com clareza e prioridade.
            </Heading>

            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={{ base: "gray.600", _dark: "gray.300" }}
            >
              O Refyne ajuda você a aplicar INVEST, registrar decisões e
              priorizar o backlog com técnicas como MoSCoW, CSD e GUT – tudo em
              um fluxo simples e visual.
            </Text>

            <HStack gap={3} flexWrap="wrap">
              {startNow()}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("como-funciona");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Info size={16} />
                Ver como funciona
              </Button>
            </HStack>

            <Text fontSize="xs" color={{ base: "gray.500", _dark: "gray.400" }}>
              Ideal POs e times que querem refinar melhor suas histórias.
            </Text>
          </Stack>
          <Box
            borderRadius="2xl"
            borderWidth="1px"
            borderColor={{ base: "gray.200", _dark: "gray.700" }}
            bg={{
              base: "white",
              _dark: "gray.950",
            }}
            boxShadow="xl"
            p={4}
          >
            <Text
              fontSize="xs"
              mb={3}
              color={{ base: "gray.500", _dark: "gray.400" }}
            >
              Exemplo de board no Refyne
            </Text>
            <Stack gap={3}>
              <Box
                borderRadius="lg"
                p={3}
                bg={{ base: "gray.50", _dark: "gray.900" }}
              >
                <Text fontSize="xs" color="gray.500">
                  US.12 • História
                </Text>
                <Text fontSize="sm" fontWeight="semibold">
                  Registrar notas dos alunos no diário online
                </Text>
              </Box>
              <Box
                borderRadius="lg"
                p={3}
                bg={{ base: "purple.50", _dark: "purple.900" }}
              >
                <Text fontSize="xs" fontWeight="semibold" mb={2}>
                  Checklist INVEST
                </Text>
                <SimpleGrid columns={2} gap={2} fontSize="xs">
                  <Text>✅ Independente</Text>
                  <Text>✅ Valiosa</Text>
                  <Text>✅ Testável</Text>
                  <Text>⚪ Estimável</Text>
                  <Text>⚪ Pequena</Text>
                  <Text>⚪ Negociável</Text>
                </SimpleGrid>
              </Box>
              <SimpleGrid columns={2} gap={3}>
                <Box
                  borderRadius="lg"
                  p={3}
                  bg={{ base: "orange.50", _dark: "orange.800" }}
                >
                  <Text fontSize="xs" fontWeight="semibold" mb={1}>
                    Prioridade
                  </Text>
                  <Text fontSize="xs">MoSCoW: Deve ter</Text>
                  <Text fontSize="xs">CSD: Certeza</Text>
                  <Text fontSize="xs">GUT: 80 pts</Text>
                </Box>
                <Box
                  borderRadius="lg"
                  p={3}
                  bg={{ base: "gray.50", _dark: "gray.900" }}
                >
                  <Text fontSize="xs" fontWeight="semibold" mb={1}>
                    Comentários
                  </Text>
                  <Text fontSize="xs">
                    “Decidimos dividir a história em duas para facilitar o teste
                    e o rollout…”
                  </Text>
                </Box>
              </SimpleGrid>
            </Stack>
          </Box>
        </SimpleGrid>
        <Box id="como-funciona" mt={{ base: 14, md: 20 }}>
          <Stack gap={2} mb={6} textAlign="center">
            <Heading as="h2" size="md">
              Por que usar o Refyne?
            </Heading>
            <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.300" }}>
              Traga mais clareza para suas histórias de usuário e conversas de
              refinamento.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <FeatureCard
              title="Refinamento guiado por INVEST"
              description="Checklist INVEST para cada história, ajudando o time a garantir independência, valor e testabilidade."
            />

            {/* <FeatureCard
              title="Sugestões inteligentes com IA"
              description="Use IA para transformar descrições soltas em histórias claras no formato 'Como, eu quero, para', alinhadas ao INVEST."
              icon={
                <Image
                  src={aiIcon}
                  alt="Ícone de inteligência artificial"
                  width={76}
                  height={76}
                  style={{ borderRadius: 12 }}
                />
              }
            /> */}
            <FeatureCard
              title="Priorização visual do backlog"
              description="Aplique MoSCoW, CSD e GUT em uma só tela para comparar histórias e tomar decisões de roadmap com critérios claros."
            />
            <FeatureCard
              title="Histórico de decisões"
              description="Comentários ligados a cada história, registrando dúvidas, acordos e mudanças de escopo."
            />
          </SimpleGrid>
        </Box>
        <Box mt={{ base: 12, md: 16 }}>
          <Flex
            borderRadius="2xl"
            p={{ base: 4, md: 6 }}
            bg={{ base: "gray.900", _dark: "gray.800" }}
            color="gray.50"
            align="center"
            justify="space-between"
            direction={{ base: "column", md: "row" }}
            gap={4}
          >
            <Box>
              <Text fontSize="sm" fontWeight="medium">
                Pronto para refinar seu backlog?
              </Text>
              <Text fontSize="xs" color="gray.300">
                Crie um board, cadastre suas histórias e comece o refinamento em
                poucos minutos.
              </Text>
            </Box>
            {startNow()}
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <Box
      borderRadius="xl"
      borderWidth="1px"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      bg={{ base: "white", _dark: "gray.900" }}
      p={6}
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={3}
    >
      {icon && (
        <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
          {icon}
        </Box>
      )}

      <Text fontSize="sm" fontWeight="semibold">
        {title}
      </Text>

      <Text
        fontSize="xs"
        color={{ base: "gray.600", _dark: "gray.300" }}
        maxW="250px"
      >
        {description}
      </Text>
    </Box>
  );
}
