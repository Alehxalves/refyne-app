"use client";

import {
  Button,
  CloseButton,
  Dialog,
  DialogBodyProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface ConfirmActionProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;

  onConfirm: () => Promise<void> | void;
  bg?: string;

  children?: React.ReactNode;
  dialogProps?: DialogContentProps;
  headerProps?: DialogHeaderProps;
  titleProps?: DialogTitleProps;
  bodyProps?: DialogBodyProps;
}

export default function ConfirmAction({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  bg = "red.500",
  children,
  dialogProps,
  headerProps,
  titleProps,
  bodyProps,
}: ConfirmActionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Erro ao executar ação de confirmação:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog.Root
      key="confirm-action-dialog"
      size={{ base: "sm", md: "lg", lg: "lg" }}
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content {...dialogProps} onClick={(e) => e.stopPropagation()}>
            <Dialog.Header flexDir="column" {...headerProps}>
              <Dialog.Title {...titleProps}>{title}</Dialog.Title>
              {description && (
                <Text
                  mt="1"
                  fontSize="sm"
                  color={{ base: "gray.600", _dark: "gray.400" }}
                  {...bodyProps}
                >
                  {description}
                </Text>
              )}
            </Dialog.Header>

            <Dialog.Body>{children && <>{children}</>}</Dialog.Body>

            <Dialog.Footer>
              <Stack direction="row" justify="flex-end" gap="2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {cancelLabel}
                </Button>
                <Button
                  size="sm"
                  bg={bg}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  onClick={handleConfirm}
                >
                  {confirmLabel}
                </Button>
              </Stack>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
