import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { useVitrine } from "@/lib/vitrine";

export const Route = createFileRoute("/buscar")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Buscar — Vitorino Vitrines" },
      { name: "description", content: "Encontre produtos publicados na sua vitrine." },
      { property: "og:title", content: "Buscar — Vitorino Vitrines" },
      { property: "og:description", content: "Encontre produtos publicados na sua vitrine." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BuscarPagina,
});

function BuscarPagina() {
  const [termo, setTermo] = useState("");
  const { produtos } = useVitrine();
  const alvo = termo.trim().toLowerCase();
  const lista = alvo
    ? produtos.filter(
        (p) =>
          p.nome.toLowerCase().includes(alvo) || p.descricao.toLowerCase().includes(alvo),
      )
    : produtos;

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-semibold">Buscar</h1>
      <input
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="Nome do produto"
        className="mt-3 w-full rounded-full border border-border bg-card px-5 py-3 text-sm outline-none focus:border-primary"
      />

      {lista.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Nenhum produto encontrado.</p>
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
