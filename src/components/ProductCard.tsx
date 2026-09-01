import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { formatarPreco, type Produto } from "@/lib/catalog";

/** Card em formato de carrossel: arraste dentro do card para ver fotos e vídeos. */
export function ProductCard({ produto }: { produto: Produto }) {
  const trilha = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);

  function aoRolar() {
    const el = trilha.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
    if (i !== ativo) setAtivo(i);
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-card">
      <div className="relative aspect-[4/5] bg-surface">
        <div
          ref={trilha}
          onScroll={aoRolar}
          className="no-scrollbar snap-row flex h-full overflow-x-auto"
        >
          {produto.midias.map((midia, i) => (
            <div key={midia.url + i} className="h-full w-full shrink-0 snap-center">
              {midia.tipo === "video" ? (
                <video
                  src={midia.url}
                  className="h-full w-full object-cover"
                  playsInline
                  muted
                  loop
                  controls
                />
              ) : (
                <img src={midia.url} alt={midia.alt} className="h-full w-full object-cover" />
              )}
            </div>
          ))}
        </div>

        {produto.midias.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {produto.midias.map((_, i) => (
              <span
                key={i}
                className={
                  "size-1.5 rounded-full transition-colors " +
                  (i === ativo ? "bg-ink-foreground" : "bg-ink-foreground/40")
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <Link
          to="/produto/$id"
          params={{ id: produto.id }}
          className="line-clamp-2 text-[13px] leading-snug font-medium text-foreground"
        >
          {produto.nome}
        </Link>
        <span className="mt-1.5 text-base font-bold text-primary">
          {formatarPreco(produto.preco)}
        </span>
      </div>
    </article>
  );
}
