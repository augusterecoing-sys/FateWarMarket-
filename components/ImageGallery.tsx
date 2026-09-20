"use client";

import { useState } from "react";

type Img = { id: string; url: string };

export default function ImageGallery({ images, title }: { images: Img[]; title: string }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.id}
            src={img.url}
            alt={title}
            onClick={() => setSelected(img.url)}
            style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(243,233,218,0.1)", cursor: "pointer" }}
          />
        ))}
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,8,6,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
        >
          <button
            onClick={() => setSelected(null)}
            aria-label="Fermer"
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              background: "rgba(243,233,218,0.1)",
              border: "1px solid rgba(243,233,218,0.25)",
              color: "#F3E9DA",
              width: 40,
              height: 40,
              borderRadius: "50%",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected}
            alt={title}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "88vh", objectFit: "contain", borderRadius: 8 }}
          />
        </div>
      )}
    </>
  );
}
