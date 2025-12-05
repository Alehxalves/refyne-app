"use client";

import { Box, Collapsible, HStack, Text } from "@chakra-ui/react";
import { Lightbulb } from "lucide-react";

export const goodStoryTip = () => {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger
        paddingY="3"
        display="flex"
        gap="2"
        alignItems="center"
      >
        <Collapsible.Indicator cursor="pointer">
          <HStack gap="1">
            <Lightbulb color="#EAB308" size="18" />
            <Text
              fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
              fontWeight="medium"
              textAlign="left"
            >
              Dica rápida: Como escrever histórias de usuário de forma clara
            </Text>
          </HStack>
        </Collapsible.Indicator>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Box
          w="100%"
          bg="gray.50"
          _dark={{ bg: "gray.800" }}
          border="1px solid"
          borderColor={{ base: "gray.200", _dark: "gray.700" }}
          borderRadius="md"
          p="3"
          fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
        >
          <Text fontWeight="medium" mb="1">
            Use o formato abaixo para explicar quem precisa, o que deseja e por
            quê:
          </Text>
          <Text color="gray.700" _dark={{ color: "gray.300" }}>
            Utilize o formato:
          </Text>
          <Box
            mt="2"
            p="2"
            bg="white"
            _dark={{ bg: "gray.900" }}
            borderRadius="md"
            border="1px dashed"
            borderColor={{ base: "gray.300", _dark: "gray.600" }}
            fontFamily="mono"
            fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
          >
            Como <b>[persona]</b>, eu <b>[quero]</b> <i>[algo]</i> para{" "}
            <b>[alcançar um objetivo]</b>.
          </Box>
          <Text mt="2" color="gray.600" _dark={{ color: "gray.400" }}>
            Exemplo:<b> Como</b> professor, eu <b>quero</b> registrar as notas
            dos alunos <b>para</b> acompanhar o desempenho da turma.
          </Text>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
