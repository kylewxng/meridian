"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

// A firm employee who lands on the client side is by definition looking at
// their own return, so flip the context rather than showing them firm chrome
// wrapped around client content.
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { me, context, setContext } = useStore();

  useEffect(() => {
    if (me.side === "firm" && context !== "personal") setContext("personal");
  }, [me.side, context, setContext]);

  return <>{children}</>;
}
