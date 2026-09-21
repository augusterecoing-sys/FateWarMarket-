export const ACCOUNT_TYPES: { value: string; label: string; icon: string }[] = [
  { value: "archers", label: "Archers", icon: "🏹" },
  { value: "berserker", label: "Berserker", icon: "🪓" },
  { value: "cavalry", label: "Cavalry", icon: "🐎" },
];

export function accountTypeLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  return ACCOUNT_TYPES.find((t) => t.value === value)?.label ?? null;
}

export function accountTypeIcon(value: string | null | undefined): string {
  return ACCOUNT_TYPES.find((t) => t.value === value)?.icon ?? "⚔️";
}
