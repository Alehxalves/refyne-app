"use client";

import LandingPage from "@/components/LandingPage";
import { NavBar } from "@/components/nav-bar";
import { Flex } from "@chakra-ui/react";
import React from "react";

export default function RootPage() {
  return (
    <Flex
      direction="column"
      minH="100vh"
      bg={{ base: "gray.50", _dark: "gray.900" }}
    >
      <NavBar />
      <LandingPage />
    </Flex>
  );
}
