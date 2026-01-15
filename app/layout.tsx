import "@/styles/globals.css";
import "@/styles/app.css"
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import Navbar from "@/components/Layout/AppNavbar";
import {ToastProvider} from "@heroui/toast"
import AppNavbar from "@/components/Layout/AppNavbar";
import Footer from "@/components/Layout/Footer";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <ToastProvider
          placement="bottom-center"
          toastOffset={20}
          toastProps={{
            radius: "md",
            variant: "flat",
            timeout: 5000,
            hideIcon: true
          }}
          />
          <div className="relative flex flex-col grow justify-between">
            <AppNavbar />
              {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
