import { useEffect, useState } from "react";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const CHAVE = "vitorino-install-dispensado";

/** Convite para instalar o app na tela inicial (PWA standalone). */
export function InstallPrompt() {
  const [evento, setEvento] = useState<PromptEvent | null>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(CHAVE) === "1") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    function aoDisponibilizar(e: Event) {
      e.preventDefault();
      setEvento(e as PromptEvent);
      setVisivel(true);
    }

    window.addEventListener("beforeinstallprompt", aoDisponibilizar);
    return () => window.removeEventListener("beforeinstallprompt", aoDisponibilizar);
  }, []);

  function dispensar() {
    window.localStorage.setItem(CHAVE, "1");
    setVisivel(false);
  }

  async function instalar() {
    if (!evento) return;
    await evento.prompt();
    await evento.userChoice;
    dispensar();
  }

  if (!visivel) return null;

  return (
    <div className="fixed inset-x-0 top-3 z-50 px-3">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-card">
        <img src="/icon-192.png" alt="" width={40} height={40} className="size-10 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Instalar Vitorino Vitrines</p>
          <p className="text-xs text-muted-foreground">Abre como aplicativo, sem barra do navegador.</p>
        </div>
        <button
          type="button"
          onClick={instalar}
          className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
        >
          Instalar
        </button>
        <button
          type="button"
          onClick={dispensar}
          aria-label="Dispensar"
          className="shrink-0 text-muted-foreground"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
