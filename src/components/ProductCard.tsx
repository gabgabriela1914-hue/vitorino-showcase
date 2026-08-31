import { Link } from "@tanstack/react-router";
import { formatarPreco, type Produto } from "@/lib/catalog";

export function ProductCard({ produto }: { produto: Produto }) {
  const capa = produto.midias[0];
  const desconto = produto.precoAntigo
    ? Math.round((1 - produto.preco / produto.precoAntigo) * 100)
    : 0;

  return (
    <Link
      to="/produto/$id"
      params={{ id: produto.id }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-transform active:scale-[0.98]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {capa?.tipo === "video" ? (
          <video
            src={capa.url}
            poster={capa.poster}
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={capa?.url}
            alt={capa?.alt ?? produto.nome}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {desconto > 0 && (
          <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
            -{desconto}%
          </span>
        )}
        {produto.midias.length > 1 && (
          <span className="absolute right-2 bottom-2 rounded-full bg-ink/65 px-2 py-0.5 text-[10px] font-medium text-ink-foreground">
            {produto.midias.length} mídias
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 font-sans text-[13px] leading-snug font-medium text-foreground">
          {produto.nome}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-base font-bold text-primary">{formatarPreco(produto.preco)}</span>
          {produto.precoAntigo && (
            <span className="text-[11px] text-muted-foreground line-through">
              {formatarPreco(produto.precoAntigo)}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {produto.parcelas}x de {formatarPreco(produto.preco / produto.parcelas)}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="text-gold">★ {produto.avaliacao.toFixed(1)}</span>
          <span aria-hidden>·</span>
          <span>{produto.vendidos} vendidos</span>
        </div>
      </div>
    </Link>
  );
}
