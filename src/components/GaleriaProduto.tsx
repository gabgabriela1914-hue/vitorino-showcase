import { useRef, useState } from "react";
import type { Midia } from "@/lib/catalog";

/** Galeria do produto: arraste entre fotos e vídeos, com miniaturas. */
export function GaleriaProduto({ midias, nome }: { midias: Midia[]; nome: string }) {
  const trilhaRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);

  function selecionar(indice: number) {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    trilha.scrollTo({ left: indice * trilha.clientWidth, behavior: "smooth" });
    setAtivo(indice);
  }

  function aoRolar() {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    const indice = Math.round(trilha.scrollLeft / Math.max(trilha.clientWidth, 1));
    if (indice !== ativo) setAtivo(indice);
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-surface">
        <div ref={trilhaRef} onScroll={aoRolar} className="no-scrollbar snap-row flex overflow-x-auto">
          {midias.map((midia, i) => (
            <div key={midia.url + i} className="aspect-square w-full shrink-0">
              {midia.tipo === "video" ? (
                <video
                  className="h-full w-full object-cover"
                  src={midia.url}
                  poster={midia.poster}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={midia.alt}
                />
              ) : (
                <img
                  src={midia.url}
                  alt={midia.alt || nome}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
        <span className="absolute right-3 bottom-3 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-medium text-ink-foreground">
          {ativo + 1}/{midias.length}
        </span>
      </div>

      {midias.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {midias.map((midia, i) => (
            <button
              key={"t" + i}
              type="button"
              onClick={() => selecionar(i)}
              aria-label={`Ver mídia ${i + 1}`}
              className={
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors " +
                (i === ativo ? "border-primary" : "border-transparent")
              }
            >
              <img
                src={midia.tipo === "video" ? (midia.poster ?? "") : midia.url}
                alt=""
                loading="lazy"
                className="h-full w-full bg-muted object-cover"
              />
              {midia.tipo === "video" && (
                <span className="absolute inset-0 grid place-items-center bg-ink/45 text-sm text-ink-foreground">
                  ▶
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
