import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GaleriaProduto } from "@/components/GaleriaProduto";
import { PixInstrucoes } from "@/components/PixBlock";
import { formatarPreco, nomeCategoria, WHATSAPP } from "@/lib/catalog";
import { remover, useVitrine } from "@/lib/vitrine";

export const Route = createFileRoute("/produto/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Produto — Vitorino Vitrines" },
      { name: "description", content: "Detalhes do produto publicado, com pagamento via Pix." },
      { property: "og:title", content: "Produto — Vitorino Vitrines" },
      { property: "og:description", content: "Detalhes do produto publicado, com pagamento via Pix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProdutoPagina,
});

function ProdutoPagina() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { produtos, carregando } = useVitrine();
  const produto = produtos.find((p) => p.id === id);
  const [tamanho, setTamanho] = useState<string | null>(null);

  if (carregando) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </AppShell>
    );
  }

  if (!produto) {
    return (
      <AppShell>
        <div className="rounded-2xl bg-card p-8 text-center shadow-card">
          <h1 className="font-display text-2xl font-semibold">Produto não encontrado</h1>
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
        <h1 className="font-display text-2xl leading-tight font-semibold">{produto.nome}</h1>
        <p className="mt-2 text-3xl font-bold text-primary">{formatarPreco(produto.preco)}</p>
        {produto.descricao && (
          <p className="mt-4 text-sm leading-relaxed text-foreground/85">{produto.descricao}</p>
        )}

        {produto.tamanhos.length > 0 && (
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
                    "rounded-full border px-4 py-2 text-sm font-medium " +
                    (tamanho === t ? "border-ink bg-ink text-ink-foreground" : "border-border bg-card")
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <a
          href={`https://wa.me/${WHATSAPP}?text=${mensagem}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-card"
        >
          Comprar pelo WhatsApp
        </a>
      </section>

      <div className="mt-6">
        <PixInstrucoes produto={produto.nome} valor={produto.preco} />
      </div>

      <button
        type="button"
        onClick={async () => {
          await remover(produto.id);
          void navigate({ to: "/" });
        }}
        className="mt-6 w-full rounded-full border border-border py-3 text-sm font-semibold text-muted-foreground"
      >
        Remover da vitrine
      </button>
    </AppShell>
  );
}
