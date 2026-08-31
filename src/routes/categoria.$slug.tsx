import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { nomeCategoria, type CategoriaSlug } from "@/lib/catalog";
import { produtosQueryOptions } from "@/lib/produtos";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ context }) => context.queryClient.ensureQueryData(produtosQueryOptions),
  head: ({ params }) => {
    const nome = nomeCategoria(params.slug as CategoriaSlug);
    return {
      meta: [
        { title: `${nome} — Vitorino Vitrines` },
        { name: "description", content: `${nome} selecionados com pagamento direto no Pix.` },
        { property: "og:title", content: `${nome} — Vitorino Vitrines` },
        { property: "og:description", content: `${nome} selecionados com pagamento direto no Pix.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Categoria,
});

function Categoria() {
  const { slug } = Route.useParams();
  const { data: produtos } = useSuspenseQuery(produtosQueryOptions);
  const filtrados = produtos.filter((p) => p.categoria === slug);

  return (
    <AppShell>
      <header className="mb-4">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">
          Categoria
        </p>
        <h1 className="font-display text-3xl font-semibold">
          {nomeCategoria(slug as CategoriaSlug)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtrados.length} produtos</p>
      </header>

      {filtrados.length === 0 ? (
        <p className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground shadow-card">
          Nenhum produto nesta categoria ainda. Volte em breve!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtrados.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
