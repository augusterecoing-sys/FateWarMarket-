"use client";

export default function DeleteConversationButton({
  action,
  conversationId,
}: {
  action: (formData: FormData) => void;
  conversationId: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="conversationId" value={conversationId} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("Supprimer définitivement cette conversation ? Cette action est irréversible.")) {
            e.preventDefault();
          }
        }}
        style={{
          background: "none",
          color: "#C9695A",
          fontSize: 13,
          fontWeight: 700,
          padding: "8px 14px",
          borderRadius: 8,
          border: "1px solid rgba(201,105,90,0.35)",
          cursor: "pointer",
        }}
      >
        🗑 Supprimer la conversation
      </button>
    </form>
  );
}
