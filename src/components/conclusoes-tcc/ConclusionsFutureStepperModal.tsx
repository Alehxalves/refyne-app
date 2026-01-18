"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  Portal,
  Steps,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  CircleChevronLeft,
  CircleChevronRight,
  PartyPopper,
} from "lucide-react";
import { useState } from "react";

const steps = [
  {
    title: "Pergunta de pesquisa",
    content: (
      <Text fontSize="sm" color="gray.700">
        “Como apoiar o Product Owner na aplicação sistemática de critérios de
        refinamento e na priorização do backlog, visando reduzir antipadrões e
        aumentar a previsibilidade das entregas?”
      </Text>
    ),
  },
  {
    title: "Trabalhos futuros",
    content: (
      <VStack align="flex-start" gap={2}>
        <Text fontSize="sm">• AVALIAÇÃO ESTRUTURADA DA FERRAMENTA</Text>
        <Text fontSize="sm">
          • FUNCIONALIDADES ELICITADAS (Identificação de histórias grandes,
          Matriz Valor × Esforço...)
        </Text>
        <Text fontSize="sm">• DEFINITION OF DONE</Text>
      </VStack>
    ),
  },
  {
    title: "Encerramento",
    content: (
      <Text fontSize="sm" color="gray.700">
        Obrigado pela atenção!
      </Text>
    ),
  },
];

export function ConclusionsFutureSteps() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Box position="fixed" bottom="24px" right="24px" zIndex={30}>
        <Button
          borderRadius="full"
          size="sm"
          colorScheme="purple"
          onClick={() => setIsOpen(true)}
        >
          <PartyPopper size={16} />
          Conclusões
        </Button>
      </Box>

      <Dialog.Root
        size="xl"
        open={isOpen}
        onOpenChange={(details) => {
          if (!details.open) setIsOpen(false);
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title fontSize="sm">
                  CONCLUSÕES E TRABALHOS FUTUROS 14/14
                </Dialog.Title>
                <Dialog.CloseTrigger />
              </Dialog.Header>
              <Dialog.Body>
                <Steps.Root defaultStep={0} count={steps.length}>
                  <Steps.List mb={4}>
                    {steps.map((step, index) => (
                      <Steps.Item key={index} index={index} title={step.title}>
                        <Steps.Trigger>
                          <Steps.Indicator />
                          <Steps.Title>{step.title}</Steps.Title>
                        </Steps.Trigger>
                        <Steps.Separator />
                      </Steps.Item>
                    ))}
                  </Steps.List>
                  {steps.map((step, index) => (
                    <Steps.Content key={index} index={index}>
                      <Box borderWidth="1px" borderRadius="md" p={4} mt={2}>
                        {step.content}
                      </Box>
                    </Steps.Content>
                  ))}

                  <Steps.CompletedContent>
                    <Text fontSize="sm" color="gray.600">
                      Apresentação concluída.
                    </Text>
                  </Steps.CompletedContent>
                  <ButtonGroup size="sm" variant="outline" mt={4}>
                    <Steps.PrevTrigger asChild>
                      <CircleChevronLeft cursor="pointer" />
                    </Steps.PrevTrigger>

                    <Steps.NextTrigger asChild>
                      <CircleChevronRight cursor="pointer" />
                    </Steps.NextTrigger>
                  </ButtonGroup>
                </Steps.Root>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default ConclusionsFutureSteps;
