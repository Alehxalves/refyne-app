"use client";

import {
  Box,
  Collapsible,
  HStack,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Lightbulb } from "lucide-react";

export const moscowTip = () => {
  return (
    <Collapsible.Root ml="-1">
      <Collapsible.Trigger
        paddingY="3"
        display="flex"
        gap="2"
        alignItems="center"
      >
        <Collapsible.Indicator cursor="pointer">
          <HStack maxW="100%">
            <Lightbulb color="#EAB308" />
            <Text
              fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
              fontWeight="medium"
              truncate
            >
              Dica avançada: Como usar MoSCoW para priorizar histórias
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
            A técnica <b>MoSCoW</b> ajuda a separar o que é essencial do que é
            desejável. Use essas categorias durante a priorização:
          </Text>

          <Separator w="100%" mt="2" mb="3" />

          <Stack gap="2">
            <Text>
              <b>M — Must Have (Deve ter):</b> sem isso, o produto não atende o
              objetivo mínimo.
              <i> Impacto direto em valor de negócio, risco ou conformidade.</i>
            </Text>

            <Text>
              <b>S — Should Have (Deveria ter):</b> muito importante, mas não
              crítico para o release atual.
              <i> Se necessário, pode ser adiado para o próximo incremento.</i>
            </Text>

            <Text>
              <b>C — Could Have (Poderia ter):</b> agrega valor, mas é
              complementar.
              <i> Ideal para quando há folga de capacidade no sprint.</i>
            </Text>

            <Text>
              <b>W — Won&apos;t Have (Não terá agora):</b> explicitamente fora
              do escopo deste ciclo.
              <i> Registre aqui ideias que podem voltar em outro momento.</i>
            </Text>
          </Stack>

          <Separator w="100%" mt="3" mb="3" />

          <Box
            mt="1"
            bg="blue.50"
            _dark={{ bg: "gray.700" }}
            p="3"
            borderRadius="md"
            borderLeft="4px solid #3B82F6"
          >
            <Text fontWeight="medium">💡 Dicas práticas de MoSCoW:</Text>
            <Stack mt="1" gap="1">
              <Text>
                • Evite ter “Must Have” em tudo – se tudo é prioridade máxima,
                nada é.
              </Text>
              <Text>
                • Combine MoSCoW com objetivos do release: o que é indispensável
                para validar a entrega?
              </Text>
              <Text>
                • Use o “Won&apos;t Have” para alinhar expectativas e evitar
                escopo escondido.
              </Text>
            </Stack>
          </Box>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export const csdTip = () => {
  return (
    <Collapsible.Root ml="-1">
      <Collapsible.Trigger
        paddingY="3"
        display="flex"
        gap="2"
        alignItems="center"
      >
        <Collapsible.Indicator cursor="pointer">
          <HStack maxW="100%">
            <Lightbulb color="#EAB308" />
            <Text
              fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
              fontWeight="medium"
              truncate
            >
              Dica avançada: Usando a Matriz CSD para alinhar entendimento
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
            A <b>Matriz CSD</b> ajuda a explicitar o que o time sabe, supõe e
            ainda não sabe sobre uma história:
          </Text>

          <Separator w="100%" mt="2" mb="3" />

          <Stack gap="2" mb="2">
            <Text>
              <b>C — Certezas:</b> fatos confirmados, acordos já validados com
              stakeholders.
              <i>
                {" "}
                Ex.: “O lançamento será apenas para professores da rede X”.
              </i>
            </Text>

            <Text>
              <b>S — Suposições:</b> hipóteses que parecem verdadeiras, mas não
              foram validadas.
              <i>
                {" "}
                Ex.: “Acreditamos que os professores vão usar o sistema
                diariamente”.
              </i>
            </Text>

            <Text>
              <b>D — Dúvidas:</b> perguntas em aberto que podem travar decisão
              ou desenvolvimento.
              <i> Ex.: “Quem aprova a criação de novas turmas no sistema?”.</i>
            </Text>
          </Stack>

          <Separator w="100%" mt="3" mb="3" />

          <Box
            mt="1"
            bg="green.50"
            _dark={{ bg: "gray.700" }}
            p="3"
            borderRadius="md"
            borderLeft="4px solid #22C55E"
          >
            <Text fontWeight="medium">
              💡 Como usar CSD durante o refinamento:
            </Text>
            <Stack mt="1" gap="1">
              <Text>
                • Transforme <b>dúvidas</b> em ações: quem pode responder? isso
                é bloqueador?
              </Text>
              <Text>
                • Suposições muito críticas podem virar <b>experimentos</b>{" "}
                (teste A/B, MVP, pesquisa rápida).
              </Text>
              <Text>
                • Revise a matriz CSD ao final do refinamento: algumas
                suposições podem virar certezas.
              </Text>
            </Stack>
          </Box>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export const gutTip = () => {
  return (
    <Collapsible.Root ml="-1">
      <Collapsible.Trigger
        paddingY="3"
        display="flex"
        gap="2"
        alignItems="center"
      >
        <Collapsible.Indicator cursor="pointer">
          <HStack maxW="100%">
            <Lightbulb color="#EAB308" />
            <Text
              fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
              fontWeight="medium"
              truncate
            >
              Dica avançada: Priorizando com a Matriz GUT
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
            A <b>Matriz GUT</b> atribui uma nota de <b>1 a 5</b> para cada
            dimensão:
          </Text>

          <Separator w="100%" mt="2" mb="3" />

          <Stack gap="2">
            <Text>
              <b>G — Gravidade:</b> quão sério é o impacto se nada for feito?
              <i> Afeta muitos usuários? gera risco financeiro ou legal?</i>
            </Text>

            <Text>
              <b>U — Urgência:</b> quão rápido isso precisa ser resolvido?
              <i>
                {" "}
                Existe prazo externo, janela de negócio, calendário escolar?
              </i>
            </Text>

            <Text>
              <b>T — Tendência:</b> como o problema evolui ao longo do tempo?
              <i> Vai piorar, se manter ou desaparecer sozinho?</i>
            </Text>
          </Stack>

          <Separator w="100%" mt="3" mb="3" />

          <Text mb="2">
            A pontuação final é <b>G × U × T</b>. Quanto maior o resultado,
            maior a prioridade relativa.
          </Text>

          <Box
            mt="1"
            bg="orange.50"
            _dark={{ bg: "gray.700" }}
            p="3"
            borderRadius="md"
            borderLeft="4px solid #F97316"
          >
            <Text fontWeight="medium">💡 Dicas práticas de GUT:</Text>
            <Stack mt="1" gap="1">
              <Text>
                • Evite dar nota 5 em tudo – compare histórias entre si, não no
                absoluto.
              </Text>
              <Text>
                • Use GUT principalmente para itens de manutenção, riscos e
                dívidas técnicas.
              </Text>
              <Text>
                • Combine a pontuação GUT com MoSCoW para decidir o que entra no
                próximo sprint.
              </Text>
            </Stack>
          </Box>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
