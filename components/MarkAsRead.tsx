"use client";

import { useEffect, useRef } from "react";

export default function MarkAsRead({ action, conversationId }: { action: (id: string) => Promise<void>; conversationId: string }) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    action(conversationId);
  }, [action, conversationId]);
  return null;
}
