"use client";

import { queryClient } from "@/lib/react-query";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { ptBR } from "@clerk/localizations";
import { dark, experimental__simple } from "@clerk/themes";
import { useColorMode } from "@/components/ui/color-mode";
import SupabaseProvider from "@/lib/supabase/SupabaseProvider";

export function CoreProvider({ children }: { children: React.ReactNode }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <ClerkProvider
      localization={ptBR}
      appearance={{
        theme: isDark ? dark : experimental__simple,
        cssLayerName: "clerk",
      }}
    >
      <SupabaseProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SupabaseProvider>
    </ClerkProvider>
  );
}
