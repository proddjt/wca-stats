"use client";

import * as React from "react";

import type { ThemeProviderProps } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import IsLoadingProvider from "@/Context/IsLoading/IsLoadingProvider";


export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      
      <IsLoadingProvider>
        <NextThemesProvider {...themeProps}>
          {children}
        </NextThemesProvider>
      </IsLoadingProvider>
    </HeroUIProvider>
  );
}
