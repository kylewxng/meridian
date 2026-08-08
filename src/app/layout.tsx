import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import AppShell from "@/components/shell/AppShell";

// A real typeface rather than whatever the OS supplies. Inter holds its shape
// at the 11-13px sizes this product lives at, and ships tabular figures, which
// every money column depends on.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Meridian · Tax platform prototype",
  description:
    "A client and CPA tax platform built from scratch for the AI Engineer case study.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
