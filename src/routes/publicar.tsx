import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CapturaMidia } from "@/components/CapturaMidia";
import { CATEGORIAS, type CategoriaSlug } from "@/lib/catalog";
import { publicar, type MidiaArquivo } from "@/lib/vitrine";

export const Route = createFileRoute("/publicar")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Publicar produto — Vitorino Vitrines" },
      {
        name: "description",
        content: "Fotografe, grave um vídeo ou escolha da galeria e publique na sua vitrine.",
      },
      { property: "og:title", content: "Publicar produto — Vitorino Vitrines" },
      {
        property: "og:description",
        content: "Fotografe, grave um vídeo ou escolha da galeria e publique na sua vitrine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PublicarPagina,
});

function PublicarPagina() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState<CategoriaSlug>("roupas");
  const [descricao, setDescricao] = useState("");
  const [tamanhos, setTamanhos] = useState("");
  const [midias, setMidias] = useState<MidiaArquivo[]>([]);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!nome.trim()) return setErro("Dê um nome ao produto.");
    if (midias.length === 0) return setErro("Adicione ao menos uma foto ou vídeo.");
    setErro("");
    setSalvando(true);
    try {
      await publicar({
        nome: nome.trim(),
        preco: Number(preco.replace(",", ".")) || 0,
        categoria,
        descricao: descricao.trim(),
        tamanhos: tamanhos
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        midias,
      });
      void navigate({ to: "/" });
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
      setSalvando(false);
    }
  }

  const campo =
    "mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-semibold">Publicar produto</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Só aparece na vitrine o que você publicar aqui.
      </p>

      <form onSubmit={enviar} className="mt-5 space-y-4">
        <div>
          <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Fotos e vídeos
          </label>
          <div className="mt-2">
            <CapturaMidia midias={midias} aoMudar={setMidias} />
          </div>
        </div>

        <div>
          <label htmlFor="nome" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Nome
          </label>
          <input id="nome" className={campo} value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div>
          <label htmlFor="preco" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Preço (R$)
          </label>
          <input
            id="preco"
            inputMode="decimal"
            className={campo}
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>

        <div>
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Categoria
          </span>
          <div className="mt-2 flex gap-2">
            {CATEGORIAS.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCategoria(c.slug)}
                className={
                  "flex-1 rounded-full border px-3 py-2 text-xs font-semibold " +
                  (categoria === c.slug
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-border bg-card")
                }
              >
                {c.emoji} {c.nome}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="tamanhos" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Tamanhos (separados por vírgula)
          </label>
          <input
            id="tamanhos"
            className={campo}
            value={tamanhos}
            onChange={(e) => setTamanhos(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="descricao" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Descrição
          </label>
          <textarea
            id="descricao"
            rows={4}
            className={campo}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        {erro && <p className="text-sm text-primary">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground disabled:opacity-60"
        >
          {salvando ? "Publicando…" : "Publicar na vitrine"}
        </button>
      </form>
    </AppShell>
  );
}
