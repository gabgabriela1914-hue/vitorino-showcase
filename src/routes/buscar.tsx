import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { produtosQueryOptions } from "@/lib/produtos";

export const Route = createFileRoute("/buscar")({
  loader: ({ context }) => context.queryClient.ensureQueryData(produtosQueryOptions),
  head: () => ({
    meta: [
      { title: "Buscar — Vitorino Vitrines" },
      { name: "description", content: "Busque roupas, calçados e acessórios na Vitorino Vitrines." },
      { property: "og:title", content: "Buscar — Vitorino Vitrines" },
      {
        property: "og:description",
        content: "Busque roupas, calçados e acessórios na Vitorino Vitrines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Buscar,
});

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function Buscar() {
  const { data: produtos } = useSuspenseQuery(produtosQueryOptions);
  const [termo, setTermo] = useState("");

  const resultados = useMemo(() => {
    const q = normalizar(termo.trim());
    if (!q) return produtos;
    return produtos.filter(
      (p) => normalizar(p.nome).includes(q) || normalizar(p.descricao).includes(q),
    );
  }, [produtos, termo]);

  return (
    <AppShell>
      <header className="mb-4">
        <h1 className="font-display text-3xl font-semibold">Buscar</h1>
      </header>

      <input
        type="search"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="Ex.: vestido, tênis, bolsa…"
        autoFocus
        className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
      />

      <p className="mt-3 text-xs text-muted-foreground">
        {termo.trim()
          ? `${resultados.length} resultado(s) para “${termo.trim()}”`
          : `${resultados.length} produtos na vitrine`}
      </p>

      {resultados.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground shadow-card">
          Nada encontrado. Tente outra palavra.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {resultados.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
