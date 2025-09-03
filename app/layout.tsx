import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { QueryProviders } from "@/core/providers/query-prodiver";
import { ModalProvider } from "@/core/providers/modal-provider";
import { Toaster } from "@/core/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Houfan",
  description: "Research & Transform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.png" />
      <body className={inter.className}>
        <QueryProviders>
          <ModalProvider>
            {children}

            <Toaster />
             <Analytics />
      <SpeedInsights />
          </ModalProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
