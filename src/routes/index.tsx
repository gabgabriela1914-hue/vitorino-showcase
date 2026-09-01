import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIAS } from "@/lib/catalog";
import { useVitrine } from "@/lib/vitrine";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Vitorino Vitrines — sua vitrine de moda no Pix" },
      {
        name: "description",
        content:
          "Publique suas roupas, calçados e acessórios com foto, vídeo ou galeria do celular e receba via Pix.",
      },
      { property: "og:title", content: "Vitorino Vitrines" },
      {
        property: "og:description",
        content: "Publique seus produtos com foto e vídeo do celular e receba via Pix.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Vitrine,
});

function Vitrine() {
  const { produtos, carregando } = useVitrine();

  return (
    <AppShell>
      <section className="rounded-2xl bg-ink p-5 text-ink-foreground">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-gold uppercase">
          Sua vitrine
        </p>
        <h1 className="font-display mt-1 text-2xl font-semibold">Publique um produto</h1>
        <p className="mt-1 text-sm text-ink-foreground/70">
          Cada card abre a câmera do celular: escolha foto, vídeo ou galeria.
        </p>
        <Link
          to="/publicar"
          className="mt-4 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground"
        >
          + Novo produto
        </Link>
      </section>

      <section aria-label="Categorias" className="mt-6 grid grid-cols-3 gap-3">
        {CATEGORIAS.map((c) => (
          <Link
            key={c.slug}
            to="/categoria/$slug"
            params={{ slug: c.slug }}
            className="flex flex-col items-center gap-2 rounded-2xl bg-card py-4 shadow-card active:scale-95"
          >
            <span className="grid size-11 place-items-center rounded-full bg-surface text-xl">
              {c.emoji}
            </span>
            <span className="text-xs font-semibold">{c.nome}</span>
          </Link>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">Publicados</h2>
          <span className="text-xs text-muted-foreground">{produtos.length} itens</span>
        </div>

        {carregando ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : produtos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Sua vitrine ainda está vazia. Nada é criado automaticamente — só o que você publicar
              aparece aqui.
            </p>
            <Link
              to="/publicar"
              className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Publicar primeiro produto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {produtos.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
