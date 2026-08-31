import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PixInstrucoes } from "@/components/PixBlock";

export const Route = createFileRoute("/pagamento")({
  head: () => ({
    meta: [
      { title: "Pagamento via Pix — Vitorino Vitrines" },
      {
        name: "description",
        content: "Chave Pix e instruções de pagamento da Vitorino Vitrines.",
      },
      { property: "og:title", content: "Pagamento via Pix — Vitorino Vitrines" },
      {
        property: "og:description",
        content: "Chave Pix e instruções de pagamento da Vitorino Vitrines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pagamento,
});

function Pagamento() {
  return (
    <AppShell>
      <header className="mb-4">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">
          Rápido e sem taxas
        </p>
        <h1 className="font-display text-3xl font-semibold">Pagamento via Pix</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pague direto na nossa chave e envie o comprovante pelo WhatsApp.
        </p>
      </header>
      <PixInstrucoes />
    </AppShell>
  );
}
