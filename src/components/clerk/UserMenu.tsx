"use client";

import { List } from "@chakra-ui/react";
import { UserButton } from "@clerk/nextjs";
import { SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { useColorMode } from "../ui/color-mode";
import { LuCircleCheck, LuCircleDashed } from "react-icons/lu";

const userButtonAppearance = {
  elements: {
    userButtonAvatarBox: {
      width: "32px",
      height: "32px",
      borderRadius: "9999px",
    },
    userButtonBox: {
      padding: "0",
      borderRadius: "9999px",
    },
    userButtonPopoverCard: {
      borderRadius: "12px",
    },
  },
};

export default function UserMenu() {
  const { setTheme } = useTheme();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const handleMenuThemeChange = (theme: "light" | "dark") => {
    setTheme(theme);
  };

  return (
    <UserButton appearance={userButtonAppearance}>
      <UserButton.UserProfilePage
        label="Tema"
        labelIcon={<SunMoonIcon size="20px" />}
        url="theme"
      >
        <List.Root gap="2" variant="plain" align="center">
          <List.Item
            cursor="pointer"
            onClick={() => handleMenuThemeChange("light")}
          >
            <List.Indicator asChild color={!isDark ? "green.500" : "gray.500"}>
              {!isDark ? <LuCircleCheck /> : <LuCircleDashed />}
            </List.Indicator>
            Padrão
          </List.Item>
          <List.Item
            cursor="pointer"
            onClick={() => handleMenuThemeChange("dark")}
          >
            <List.Indicator asChild color={isDark ? "green.500" : "gray.500"}>
              {isDark ? <LuCircleCheck /> : <LuCircleDashed />}
            </List.Indicator>
            Escuro
          </List.Item>
        </List.Root>
      </UserButton.UserProfilePage>
    </UserButton>
  );
}
