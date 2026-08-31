import { useState } from "react";
import { PIX, WHATSAPP, formatarPreco } from "@/lib/catalog";

function useCopiar() {
  const [copiado, setCopiado] = useState(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(PIX.chaveCopiavel);
    } catch {
      const campo = document.createElement("textarea");
      campo.value = PIX.chaveCopiavel;
      document.body.appendChild(campo);
      campo.select();
      document.execCommand("copy");
      campo.remove();
    }
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 2000);
  }
  return { copiado, copiar };
}

/** Barra fixa com a chave Pix — presente em todas as telas. */
export function PixBar() {
  const { copiado, copiar } = useCopiar();

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 px-3 pb-2">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-ink px-4 py-2.5 shadow-float">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-[0.22em] text-gold uppercase">
            Pagamento via Pix
          </p>
          <p className="truncate text-sm font-semibold text-ink-foreground">{PIX.chave}</p>
        </div>
        <button
          type="button"
          onClick={copiar}
          className="shrink-0 rounded-full bg-gold px-4 py-2 text-xs font-bold text-gold-foreground transition-transform active:scale-95"
        >
          {copiado ? "Copiado ✓" : "Copiar chave"}
        </button>
      </div>
    </div>
  );
}

/** Bloco completo com instruções — usado na página do produto. */
export function PixInstrucoes({ produto, valor }: { produto?: string; valor?: number }) {
  const { copiado, copiar } = useCopiar();
  const mensagem = encodeURIComponent(
    produto
      ? `Olá! Quero comprar: ${produto}${valor ? ` — ${formatarPreco(valor)}` : ""}. Vou pagar via Pix.`
      : "Olá! Quero comprar na Vitorino Vitrines.",
  );

  return (
    <section className="rounded-2xl bg-ink p-5 text-ink-foreground">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-gold" />
        <h2 className="text-[11px] font-semibold tracking-[0.24em] text-gold uppercase">
          Como pagar com Pix
        </h2>
      </div>

      <div className="mt-4 rounded-xl bg-ink-foreground/8 p-4">
        <p className="text-[11px] tracking-wide text-ink-foreground/60 uppercase">
          {PIX.banco}
        </p>
        <p className="mt-1 text-2xl font-semibold">{PIX.chave}</p>
        <p className="mt-0.5 text-xs text-ink-foreground/60">Titular: {PIX.titular}</p>
        <button
          type="button"
          onClick={copiar}
          className="mt-3 w-full rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground transition-transform active:scale-95"
        >
          {copiado ? "Chave copiada ✓" : "Copiar chave Pix"}
        </button>
      </div>

      <ol className="mt-4 space-y-2.5">
        {PIX.instrucoes.map((passo, i) => (
          <li key={i} className="flex gap-3 text-sm text-ink-foreground/80">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold text-[11px] font-bold text-gold-foreground">
              {i + 1}
            </span>
            <span className="leading-snug">{passo}</span>
          </li>
        ))}
      </ol>

      <a
        href={`https://wa.me/${WHATSAPP}?text=${mensagem}`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex w-full items-center justify-center rounded-full border border-ink-foreground/25 px-4 py-2.5 text-sm font-semibold text-ink-foreground"
      >
        Enviar comprovante no WhatsApp
      </a>
    </section>
  );
}
