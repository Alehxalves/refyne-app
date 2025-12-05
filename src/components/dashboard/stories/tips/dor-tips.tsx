import {
  Box,
  Collapsible,
  HStack,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Lightbulb } from "lucide-react";

export const investTip = () => {
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
              Dica avançada: Refinando histórias de usuário com INVEST
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
          <Text fontWeight="medium" mb="2">
            O modelo <b>INVEST</b> ajuda a avaliar a qualidade de uma história.
            Antes de marcar uma história como “refinada”, verifique se ela
            atende aos 6 critérios abaixo:
          </Text>
          <Separator w="100%" mt="4" mb="4" />
          <Stack gap="2" mb="4">
            <Text>
              <b>I — Independente:</b> a história deve gerar valor por si só e
              não travar a entrega de outras.
              <i>
                Evite histórias que só fazem sentido se outra for entregue
                antes.
              </i>
            </Text>

            <Text>
              <b>N — Negociável:</b> a história não é um contrato fechado. O
              time pode discutir, ajustar e negociar detalhes.
              <i>Descreva o “o quê” e o “porquê”, não o “como”.</i>
            </Text>

            <Text>
              <b>V — Valiosa:</b> precisa entregar benefício claro para o
              usuário ou para o negócio.
              <i>
                Se não gerar valor, provavelmente é uma tarefa, não uma
                história.
              </i>
            </Text>

            <Text>
              <b>E — Estimável:</b> o time consegue entender bem o suficiente
              para estimar o tamanho.
              <i>Se estiver impossível estimar, divida ou esclareça mais.</i>
            </Text>

            <Text>
              <b>S — Small (Pequena):</b> deve caber em uma única iteração ou
              sprint.
              <i>Se parecer grande demais, divida em incrementos menores.</i>
            </Text>

            <Text>
              <b>T — Testável:</b> existe uma forma clara de verificar se está
              pronto.
              <i>Use critérios de aceitação e cenários de teste.</i>
            </Text>
          </Stack>
          <Separator w="100%" mt="4" mb="4" />
          <Text fontWeight="medium" mt="4">
            ✍️ Estrutura recomendada de uma história bem escrita:
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
            Como <b>[persona]</b>, eu <b>[quero]</b> <i>[objetivo]</i> para{" "}
            <b>[benefício/resultados]</b>.
          </Box>

          <Text mt="3">
            Exemplo realista:
            <b> Como</b> professor responsável, eu <b>quero</b> registrar as
            notas dos alunos <b>para</b> acompanhar o desempenho da turma ao
            longo do período.
          </Text>

          <Box
            mt="4"
            bg="yellow.50"
            _dark={{ bg: "gray.700" }}
            p="3"
            borderRadius="md"
            borderLeft="4px solid #EAB308"
          >
            <Text fontWeight="medium">💡 Dicas práticas:</Text>
            <Stack mt="1" gap="1">
              <Text>
                • Se não conseguir marcar 3 ou mais critérios do INVEST, a
                história provavelmente precisa ser reescrita.
              </Text>
              <Text>
                • Histórias muito específicas geralmente violam o “N —
                negociável”.
              </Text>
              <Text>
                • Histórias gigantes violam o “S — pequena” e normalmente são
                épicos disfarçados.
              </Text>
              <Text>
                • Sempre escreva histórias pensando primeiro no valor entregue,
                não no sistema.
              </Text>
            </Stack>
          </Box>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
