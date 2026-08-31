import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GaleriaProduto } from "@/components/GaleriaProduto";
import { PixInstrucoes } from "@/components/PixBlock";
import { ProductCard } from "@/components/ProductCard";
import { formatarPreco, nomeCategoria, WHATSAPP } from "@/lib/catalog";
import { produtosQueryOptions } from "@/lib/produtos";

export const Route = createFileRoute("/produto/$id")({
  loader: ({ context }) => context.queryClient.ensureQueryData(produtosQueryOptions),
  head: ({ params }) => ({
    meta: [
      { title: `Produto ${params.id} — Vitorino Vitrines` },
      { name: "description", content: "Detalhes do produto com pagamento via Pix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProdutoPagina,
});

function ProdutoPagina() {
  const { id } = Route.useParams();
  const { data: produtos } = useSuspenseQuery(produtosQueryOptions);
  const produto = produtos.find((p) => p.id === id);
  const [tamanho, setTamanho] = useState<string | null>(null);

  if (!produto) {
    return (
      <AppShell>
        <div className="rounded-2xl bg-card p-8 text-center shadow-card">
          <h1 className="font-display text-2xl font-semibold">Produto não encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Este item pode ter saído da vitrine.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Voltar à vitrine
          </Link>
        </div>
      </AppShell>
    );
  }

  const relacionados = produtos
    .filter((p) => p.categoria === produto.categoria && p.id !== produto.id)
    .slice(0, 4);

  const mensagem = encodeURIComponent(
    `Olá! Quero comprar: ${produto.nome} — ${formatarPreco(produto.preco)}` +
      (tamanho ? ` (tamanho ${tamanho})` : "") +
      ". Vou pagar via Pix.",
  );

  return (
    <AppShell>
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Vitrine
        </Link>
        <span aria-hidden> / </span>
        <Link
          to="/categoria/$slug"
          params={{ slug: produto.categoria }}
          className="hover:text-foreground"
        >
          {nomeCategoria(produto.categoria)}
        </Link>
      </nav>

      <GaleriaProduto midias={produto.midias} nome={produto.nome} />

      <section className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-2xl leading-tight font-semibold">{produto.nome}</h1>
          <span className="mt-1 shrink-0 rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-gold">
            ★ {produto.avaliacao.toFixed(1)}
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">{formatarPreco(produto.preco)}</span>
          {produto.precoAntigo && (
            <span className="text-sm text-muted-foreground line-through">
              {formatarPreco(produto.precoAntigo)}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          ou {produto.parcelas}x de {formatarPreco(produto.preco / produto.parcelas)} ·{" "}
          {produto.vendidos} vendidos
        </p>

        <p className="mt-4 text-sm leading-relaxed text-foreground/85">{produto.descricao}</p>

        <div className="mt-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Tamanho
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {produto.tamanhos.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTamanho(t)}
                className={
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors " +
                  (tamanho === t
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-border bg-card")
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP}?text=${mensagem}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-card transition-transform active:scale-[0.98]"
        >
          Comprar agora pelo WhatsApp
        </a>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Pagamento direto na chave Pix abaixo · comprovante pelo WhatsApp
        </p>
      </section>

      <div className="mt-6">
        <PixInstrucoes produto={produto.nome} valor={produto.preco} />
      </div>

      {relacionados.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display mb-3 text-xl font-semibold">Você também pode gostar</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {relacionados.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
