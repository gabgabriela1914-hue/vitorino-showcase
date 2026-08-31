import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CATEGORIAS } from "@/lib/catalog";
import { PixBar } from "./PixBlock";
import { InstallPrompt } from "./InstallPrompt";

function BarraSuperior() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icon-192.png" alt="" width={32} height={32} className="size-8 rounded-lg" />
          <span className="hidden font-display text-lg leading-none font-semibold sm:block">
            Vitorino
          </span>
        </Link>
        <Link
          to="/buscar"
          className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
        >
          <span aria-hidden>⌕</span>
          Buscar roupas, calçados e acessórios
        </Link>
      </div>
      <nav className="no-scrollbar mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 pb-3">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className="shrink-0 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium"
          activeProps={{ className: "bg-ink text-ink-foreground border-ink" }}
        >
          Tudo
        </Link>
        {CATEGORIAS.map((categoria) => (
          <Link
            key={categoria.slug}
            to="/categoria/$slug"
            params={{ slug: categoria.slug }}
            className="shrink-0 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium"
            activeProps={{ className: "bg-ink text-ink-foreground border-ink" }}
          >
            {categoria.emoji} {categoria.nome}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function BarraInferior() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const itens = [
    { to: "/", rotulo: "Vitrine", icone: "⌂" },
    { to: "/categoria/$slug", params: { slug: "roupas" }, rotulo: "Categorias", icone: "▤" },
    { to: "/buscar", rotulo: "Buscar", icone: "⌕" },
    { to: "/pagamento", rotulo: "Pix", icone: "◈" },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid max-w-3xl grid-cols-4">
        {itens.map((item) => {
          const ativo =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to.split("/$")[0]!);
          return (
            <Link
              key={item.rotulo}
              to={item.to}
              // @ts-expect-error params opcional conforme a rota
              params={item.params}
              className={
                "flex flex-col items-center gap-0.5 py-2.5 text-[11px] " +
                (ativo ? "text-primary" : "text-muted-foreground")
              }
            >
              <span aria-hidden className="text-base leading-none">
                {item.icone}
              </span>
              {item.rotulo}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <BarraSuperior />
      <main className="mx-auto max-w-3xl px-4 pt-4 pb-40">{children}</main>
      <PixBar />
      <BarraInferior />
      <InstallPrompt />
    </div>
  );
}
