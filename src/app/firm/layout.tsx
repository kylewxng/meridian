"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Btn } from "@/components/common/ui";

// Hiding a nav item is presentation, not permission. The firm workspace has to
// refuse a client even when they arrive by a pasted URL.
export default function FirmLayout({ children }: { children: React.ReactNode }) {
  const { me, context, ready } = useStore();

  if (!ready) return null;

  if (me.side === "client" || context === "personal") {
    return (
      <div className="mx-auto max-w-[520px] px-5 py-16 text-center">
        <h1 className="text-[19px] font-semibold tracking-tight">
          This part of Meridian is for the firm
        </h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
          You are signed in as {me.name}, {me.roleLabel.toLowerCase()}
          {context === "personal" ? ", looking at your own return" : ""}. The firm workspace
          holds every client&rsquo;s return, so it stays closed here rather than showing you an
          empty version of it.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Btn variant="primary" href="/client">
            Go to your home page
          </Btn>
          <Btn href="/">Switch to a firm role</Btn>
        </div>
        <p className="mt-4 text-[12px] text-ink-3">
          Every firm role can be tried from the switcher in the top right, or from the{" "}
          <Link href="/" className="text-accent hover:underline">
            entry page
          </Link>
          .
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
