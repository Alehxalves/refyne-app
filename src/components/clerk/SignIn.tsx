"use client";

import React from "react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@chakra-ui/react";

const signInAppearance = {
  elements: {
    formButtonPrimary: {
      fontSize: 12,
      textTransform: "none",
    },
  },
};

interface AuthProps {
  children?: React.ReactNode;
}

export default function SignIn({ children }: AuthProps) {
  return (
    <SignInButton mode="modal" appearance={signInAppearance}>
      {children ? (
        children
      ) : (
        <Button
          bg={{ base: "gray.800", _dark: "gray.50" }}
          color={{ base: "gray.50", _dark: "gray.800" }}
          variant="outline"
          size="sm"
          fontWeight="semibold"
        >
          Entrar
        </Button>
      )}
    </SignInButton>
  );
}
