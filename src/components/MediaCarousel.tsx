import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Banner } from "@/lib/catalog";

type Props = {
  itens: Banner[];
  intervalo?: number;
};

/** Carrossel principal com arraste, autoplay e suporte a foto e vídeo. */
export function MediaCarousel({ itens, intervalo = 5200 }: Props) {
  const trilhaRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);

  const irPara = useCallback((indice: number) => {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    trilha.scrollTo({ left: indice * trilha.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (pausado || itens.length < 2) return;
    const id = window.setInterval(() => {
      const proximo = (ativo + 1) % itens.length;
      irPara(proximo);
    }, intervalo);
    return () => window.clearInterval(id);
  }, [ativo, pausado, itens.length, intervalo, irPara]);

  function aoRolar() {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    const indice = Math.round(trilha.scrollLeft / Math.max(trilha.clientWidth, 1));
    if (indice !== ativo) setAtivo(indice);
  }

  return (
    <section
      className="relative"
      aria-roledescription="carrossel"
      aria-label="Destaques da vitrine"
      onPointerDown={() => setPausado(true)}
      onPointerUp={() => setPausado(false)}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div
        ref={trilhaRef}
        onScroll={aoRolar}
        className="no-scrollbar snap-row flex overflow-x-auto rounded-2xl"
      >
        {itens.map((item, i) => (
          <article key={item.id} className="relative w-full shrink-0">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface sm:aspect-[21/9]">
              {item.midia.tipo === "video" ? (
                <video
                  className="h-full w-full object-cover"
                  src={item.midia.url}
                  poster={item.midia.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  aria-label={item.midia.alt}
                />
              ) : (
                <img
                  src={item.midia.url}
                  alt={item.midia.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in oklab, var(--ink) 88%, transparent) 5%, transparent 62%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                  Vitorino Vitrines
                </p>
                <h2 className="mt-1 text-3xl leading-none font-semibold text-ink-foreground sm:text-4xl">
                  {item.titulo}
                </h2>
                <p className="mt-1.5 max-w-sm text-sm text-ink-foreground/75">{item.subtitulo}</p>
                <Link
                  to="/categoria/$slug"
                  params={{ slug: item.destino }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
                >
                  {item.chamada}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="pointer-events-none absolute right-4 bottom-4 flex items-center gap-1.5">
        {itens.map((item, i) => (
          <span
            key={item.id}
            className={
              i === ativo
                ? "h-1.5 w-6 rounded-full bg-gold transition-all"
                : "h-1.5 w-1.5 rounded-full bg-ink-foreground/45 transition-all"
            }
          />
        ))}
      </div>
    </section>
  );
}
