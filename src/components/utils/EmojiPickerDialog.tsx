"use client";

import React, { useState } from "react";
import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { SmilePlus } from "lucide-react";
import { useColorMode } from "../ui/color-mode";

interface EmojiPickerDialogProps {
  onSelectEmoji: (emoji: string) => void;
  trigger?: React.ReactNode;
}

export function EmojiPickerDialog({
  onSelectEmoji,
  trigger,
}: EmojiPickerDialogProps) {
  const [open, setOpen] = useState(false);
  const { colorMode } = useColorMode();

  function handleEmojiClick(emojiData: EmojiClickData) {
    onSelectEmoji(emojiData.emoji);
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
      <Dialog.Trigger asChild>
        {trigger ?? <SmilePlus size="14" cursor="pointer" />}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="sm">
            <Dialog.Body padding="0" bg="transparent " mt="10">
              <EmojiPicker
                theme={colorMode === "dark" ? Theme.DARK : Theme.LIGHT}
                width="100%"
                onEmojiClick={handleEmojiClick}
                lazyLoadEmojis
              />
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
