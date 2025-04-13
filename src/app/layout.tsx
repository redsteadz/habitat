import type React from "react";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import DynamicIsland from "@/components/dynamicIsland";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HobbyStreak - Track Your Daily Habits",
  description:
    "Build consistent habits and track your daily activities with HobbyStreak",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider refetchOnWindowFocus={false}>
            <div className="relative flex min-h-screen flex-col">
              <DynamicIsland />
              <div className="flex-1">{children}</div>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
