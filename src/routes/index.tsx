import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { MediaCarousel } from "@/components/MediaCarousel";
import { ProductCard } from "@/components/ProductCard";
import { BANNERS, CATEGORIAS, nomeCategoria } from "@/lib/catalog";
import { produtosQueryOptions } from "@/lib/produtos";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(produtosQueryOptions),
  head: () => ({
    meta: [
      { title: "Vitorino Vitrines — Moda com pagamento no Pix" },
      {
        name: "description",
        content:
          "Roupas, calçados e acessórios selecionados com pagamento direto no Pix. Vitrine virtual Vitorino.",
      },
      { property: "og:title", content: "Vitorino Vitrines — Moda com pagamento no Pix" },
      {
        property: "og:description",
        content: "Roupas, calçados e acessórios selecionados com pagamento direto no Pix.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Vitrine,
});

function Vitrine() {
  const { data: produtos } = useSuspenseQuery(produtosQueryOptions);

  return (
    <AppShell>
      <MediaCarousel itens={BANNERS} />

      <section aria-label="Comprar por categoria" className="mt-6">
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIAS.map((c) => (
            <Link
              key={c.slug}
              to="/categoria/$slug"
              params={{ slug: c.slug }}
              className="flex flex-col items-center gap-2 rounded-2xl bg-card py-4 shadow-card transition-transform active:scale-95"
            >
              <span className="grid size-11 place-items-center rounded-full bg-surface text-xl">
                {c.emoji}
              </span>
              <span className="text-xs font-semibold">{c.nome}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8" aria-label="Produtos em destaque">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">
              Seleção da loja
            </p>
            <h2 className="font-display text-2xl font-semibold">Em destaque</h2>
          </div>
          <span className="text-xs text-muted-foreground">{produtos.length} itens</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {produtos.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      </section>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        {CATEGORIAS.map((c) => nomeCategoria(c.slug)).join(" · ")} · Pagamento via Pix · Envio
        combinado pelo WhatsApp
      </p>
    </AppShell>
  );
}
