import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { nomeCategoria, type CategoriaSlug } from "@/lib/catalog";
import { useVitrine } from "@/lib/vitrine";

export const Route = createFileRoute("/categoria/$slug")({
  ssr: false,
  head: ({ params }) => ({
    meta: [
      { title: `${nomeCategoria(params.slug as CategoriaSlug)} — Vitorino Vitrines` },
      {
        name: "description",
        content: `Produtos publicados na categoria ${nomeCategoria(params.slug as CategoriaSlug)}.`,
      },
      { property: "og:title", content: `${nomeCategoria(params.slug as CategoriaSlug)} — Vitorino Vitrines` },
      {
        property: "og:description",
        content: `Produtos publicados na categoria ${nomeCategoria(params.slug as CategoriaSlug)}.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CategoriaPagina,
});

function CategoriaPagina() {
  const { slug } = Route.useParams();
  const { produtos, carregando } = useVitrine();
  const lista = produtos.filter((p) => p.categoria === slug);

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-semibold">
        {nomeCategoria(slug as CategoriaSlug)}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{lista.length} publicados</p>

      {carregando ? (
        <p className="mt-6 text-sm text-muted-foreground">Carregando…</p>
      ) : lista.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Nada publicado nesta categoria ainda.</p>
          <Link
            to="/publicar"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Publicar produto
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {lista.map((p) => (
            <ProductCard key={p.id} produto={p} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
