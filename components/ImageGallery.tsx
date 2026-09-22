"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Img = { id: string; url: string };

const arrowBtn: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(20,17,13,0.7)",
  border: "1px solid rgba(243,233,218,0.25)",
  color: "#F3E9DA",
  width: 48,
  height: 48,
  borderRadius: "50%",
  fontSize: 22,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
};

export default function ImageGallery({ images, title }: { images: Img[]; title: string }) {
  // index de l'image ouverte dans le slider, null = fermé
  const [index, setIndex] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0); // décalage en px pendant le glissement du doigt
  const touchStartX = useRef<number | null>(null);
  const count = images.length;

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % count)), [count]);
  const prev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + count) % count)), [count]);

  // Clavier : flèches gauche/droite + Échap, et on bloque le scroll de la page derrière
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, next, prev, close]);

  // Swipe mobile
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    setDragX(e.touches[0].clientX - touchStartX.current);
  }
  function onTouchEnd() {
    if (dragX < -50) next();
    else if (dragX > 50) prev();
    setDragX(0);
    touchStartX.current = null;
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.id}
            src={img.url}
            alt={title}
            onClick={() => setIndex(i)}
            style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(243,233,218,0.1)", cursor: "pointer" }}
          />
        ))}
      </div>

      {index !== null && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,8,6,0.94)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
        >
          {/* Compteur */}
          <div style={{ position: "absolute", top: 26, left: 24, fontSize: 14, fontWeight: 700, color: "#F3E9DA" }}>
            {index + 1} / {count}
          </div>

          {/* Fermer */}
          <button
            onClick={close}
            aria-label="Fermer"
            style={{ ...arrowBtn, top: 20, right: 24, transform: "none", width: 40, height: 40, fontSize: 20 }}
          >
            ×
          </button>

          {/* Piste qui glisse */}
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ position: "relative", width: "100%", maxWidth: 1100, overflow: "hidden" }}
          >
            <div
              style={{
                display: "flex",
                transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
                transition: dragX === 0 ? "transform 0.35s ease" : "none",
              }}
            >
              {images.map((img) => (
                <div key={img.id} style={{ flex: "0 0 100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 64px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={title}
                    draggable={false}
                    style={{ maxWidth: "100%", maxHeight: "74vh", objectFit: "contain", borderRadius: 8 }}
                  />
                </div>
              ))}
            </div>

            {count > 1 && (
              <>
                <button onClick={prev} aria-label="Image précédente" style={{ ...arrowBtn, left: 8 }}>‹</button>
                <button onClick={next} aria-label="Image suivante" style={{ ...arrowBtn, right: 8 }}>›</button>
              </>
            )}
          </div>

          {/* Miniatures */}
          {count > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ display: "flex", gap: 8, marginTop: 18, maxWidth: "92vw", overflowX: "auto", padding: 4 }}
            >
              {images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.url}
                  alt=""
                  onClick={() => setIndex(i)}
                  style={{
                    width: 64,
                    height: 44,
                    objectFit: "cover",
                    borderRadius: 6,
                    cursor: "pointer",
                    flexShrink: 0,
                    opacity: i === index ? 1 : 0.45,
                    border: i === index ? "2px solid #E2622B" : "2px solid transparent",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
