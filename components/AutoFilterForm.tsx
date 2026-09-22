"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

// Formulaire de filtres qui s'applique tout seul :
// - case cochée/décochée -> résultats mis à jour tout de suite
// - champs Min / Max -> mis à jour 600 ms après la dernière frappe (ou Entrée)
export default function AutoFilterForm({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, startTransition] = useTransition();

  function apply() {
    if (!formRef.current) return;
    const params = new URLSearchParams();
    new FormData(formRef.current).forEach((value, key) => {
      const v = String(value).trim();
      if (v !== "") params.append(key, v);
    });
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/browse?${qs}` : "/browse", { scroll: false });
    });
  }

  function onChange(e: React.FormEvent<HTMLFormElement>) {
    const target = e.target as HTMLInputElement;
    if (timer.current) clearTimeout(timer.current);
    if (target.type === "number") {
      timer.current = setTimeout(apply, 600);
    } else {
      apply();
    }
  }

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <form
      ref={formRef}
      className={className}
      onChange={onChange}
      onSubmit={(e) => {
        e.preventDefault();
        if (timer.current) clearTimeout(timer.current);
        apply();
      }}
      style={{ ...style, position: "relative" }}
    >
      {children}
      {isPending && (
        <div style={{ fontSize: 12, fontWeight: 600, color: "#F0793B", textAlign: "center" }}>Loading…</div>
      )}
    </form>
  );
}
