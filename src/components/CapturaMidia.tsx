import { useRef } from "react";
import type { MidiaArquivo } from "@/lib/vitrine";

type Props = {
  midias: MidiaArquivo[];
  aoMudar: (midias: MidiaArquivo[]) => void;
};

/**
 * Abre a câmera do celular (foto ou vídeo) ou a galeria do aparelho.
 * Os arquivos escolhidos entram no carrossel do card.
 */
export function CapturaMidia({ midias, aoMudar }: Props) {
  const foto = useRef<HTMLInputElement>(null);
  const video = useRef<HTMLInputElement>(null);
  const galeria = useRef<HTMLInputElement>(null);

  function receber(lista: FileList | null) {
    if (!lista?.length) return;
    const novas: MidiaArquivo[] = Array.from(lista).map((arquivo) => ({
      tipo: arquivo.type.startsWith("video") ? "video" : "imagem",
      blob: arquivo,
    }));
    aoMudar([...midias, ...novas]);
  }

  const botao =
    "flex flex-1 flex-col items-center gap-1 rounded-2xl border border-border bg-card py-4 text-xs font-semibold transition-transform active:scale-95";

  return (
    <div>
      <div className="flex gap-2">
        <button type="button" className={botao} onClick={() => foto.current?.click()}>
          <span aria-hidden className="text-xl">📷</span>
          Câmera
        </button>
        <button type="button" className={botao} onClick={() => video.current?.click()}>
          <span aria-hidden className="text-xl">🎥</span>
          Vídeo
        </button>
        <button type="button" className={botao} onClick={() => galeria.current?.click()}>
          <span aria-hidden className="text-xl">🖼️</span>
          Galeria
        </button>
      </div>

      <input
        ref={foto}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => receber(e.target.files)}
      />
      <input
        ref={video}
        type="file"
        accept="video/*"
        capture="environment"
        hidden
        onChange={(e) => receber(e.target.files)}
      />
      <input
        ref={galeria}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={(e) => receber(e.target.files)}
      />

      {midias.length > 0 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {midias.map((m, i) => (
            <div key={i} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface">
              {m.tipo === "video" ? (
                <video src={URL.createObjectURL(m.blob)} className="h-full w-full object-cover" muted />
              ) : (
                <img src={URL.createObjectURL(m.blob)} alt="" className="h-full w-full object-cover" />
              )}
              <button
                type="button"
                aria-label={`Remover mídia ${i + 1}`}
                onClick={() => aoMudar(midias.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-ink/75 text-xs text-ink-foreground"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
