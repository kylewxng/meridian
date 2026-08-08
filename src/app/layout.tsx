import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import AppShell from "@/components/shell/AppShell";

export const metadata: Metadata = {
  title: "Meridian · Tax platform prototype",
  description:
    "A client and CPA tax platform built from scratch for the AI Engineer case study.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
