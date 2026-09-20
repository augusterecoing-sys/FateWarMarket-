export const ACCOUNT_TYPES: { value: string; label: string }[] = [
  { value: "archers", label: "Archers" },
  { value: "berserker", label: "Berserker" },
  { value: "cavalry", label: "Cavalry" },
];

export function accountTypeLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  return ACCOUNT_TYPES.find((t) => t.value === value)?.label ?? null;
}
