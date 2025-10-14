import type { Metadata } from "next";
import { inter, lexendDeca } from "@/app/fonts";
import cn from "@core/utils/class-names";
import NextProgress from "@core/components/next-progress";
import CarbonLayout from "@/layouts/carbon/carbon-layout";
import GlobalModal from "@/app/shared/modal-views/container";
import GlobalDrawer from "@/app/shared/drawer-views/container";
import { ThemeProvider, JotaiProvider } from "@/app/shared/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Isomorphic DnD Template",
  description: "A template for building isomorphic drag and drop applications.",
  icons: "/logo-short-light.svg",
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html
      // 💡 Prevent next-themes hydration warning
      suppressHydrationWarning
    >
      <body
        // to prevent any warning that is caused by third party extensions like Grammarly
        suppressHydrationWarning
        className={cn(inter.variable, lexendDeca.variable, "font-inter")}
      >
        <ThemeProvider>
          <NextProgress />
          <JotaiProvider>
            <CarbonLayout>{children}</CarbonLayout>
            <GlobalDrawer />
            <GlobalModal />
          </JotaiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
