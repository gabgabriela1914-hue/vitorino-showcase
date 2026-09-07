import { useCallback, useEffect, useState } from "react";
import type { CategoriaSlug, Midia, Produto } from "./catalog";
import { BUCKET, temSupabase } from "./supabase-config";
import { getSupabase } from "./supabase";

/**
 * Vitrine da usuária: nada é pré-cadastrado.
 * Cada publicação (foto, vídeo ou galeria vinda da câmera do celular)
 * é gravada no próprio aparelho via IndexedDB.
 */

const DB = "vitorino-vitrine";
const STORE = "publicacoes";
const EVENTO = "vitrine:atualizada";

export type MidiaArquivo = { tipo: "imagem" | "video"; blob: Blob };

export type PublicacaoGravada = {
  id: string;
  nome: string;
  categoria: CategoriaSlug;
  preco: number;
  descricao: string;
  tamanhos: string[];
  midias: MidiaArquivo[];
  criadoEm: number;
};

function abrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function todas(): Promise<PublicacaoGravada[]> {
  const db = await abrir();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
    req.onsuccess = () => resolve((req.result as PublicacaoGravada[]) ?? []);
    req.onerror = () => reject(req.error);
  });
}

/* ---------- Banco próprio (Supabase da usuária) ---------- */

type LinhaProduto = {
  id: string;
  title: string;
  description: string | null;
  price: number | string | null;
  category: string;
  image_url: string | null;
  sizes: string[] | null;
  media: { tipo: "imagem" | "video"; url: string }[] | null;
  created_at: string;
};

async function publicarNaNuvem(dados: Omit<PublicacaoGravada, "id" | "criadoEm">) {
  const sb = getSupabase()!;
  const id = crypto.randomUUID();
  const midias: { tipo: "imagem" | "video"; url: string }[] = [];

  for (const [i, m] of dados.midias.entries()) {
    const ext = (m.blob.type.split("/")[1] ?? "bin").replace(/[^a-z0-9]/gi, "");
    const caminho = `${id}/${i}.${ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(caminho, m.blob, {
      contentType: m.blob.type || undefined,
      upsert: true,
    });
    if (error) throw error;
    const { data } = sb.storage.from(BUCKET).getPublicUrl(caminho);
    midias.push({ tipo: m.tipo, url: data.publicUrl });
  }

  const { error } = await sb.from("products").insert({
    id,
    title: dados.nome,
    description: dados.descricao,
    price: dados.preco,
    category: dados.categoria,
    image_url: midias.find((m) => m.tipo === "imagem")?.url ?? midias[0]?.url ?? null,
    sizes: dados.tamanhos,
    media: midias,
  });
  if (error) throw error;
  return id;
}

async function lerDaNuvem(): Promise<Produto[]> {
  const sb = getSupabase()!;
  const { data, error } = await sb
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return ((data ?? []) as LinhaProduto[]).map((linha) => {
    const arquivos = linha.media?.length
      ? linha.media
      : linha.image_url
        ? [{ tipo: "imagem" as const, url: linha.image_url }]
        : [];
    return {
      id: linha.id,
      nome: linha.title,
      categoria: linha.category as CategoriaSlug,
      preco: Number(linha.price ?? 0),
      descricao: linha.description ?? "",
      tamanhos: linha.sizes ?? [],
      midias: arquivos.map((m, i) => ({
        tipo: m.tipo,
        url: m.url,
        alt: `${linha.title} — mídia ${i + 1}`,
      })) as Midia[],
      criadoEm: new Date(linha.created_at).getTime(),
    };
  });
}

/* ---------- API usada pelas telas ---------- */

export async function publicar(dados: Omit<PublicacaoGravada, "id" | "criadoEm">) {
  if (temSupabase) {
    const id = await publicarNaNuvem(dados);
    window.dispatchEvent(new Event(EVENTO));
    return id;
  }

  const db = await abrir();
  const registro: PublicacaoGravada = {
    ...dados,
    id: crypto.randomUUID(),
    criadoEm: Date.now(),
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(registro);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  window.dispatchEvent(new Event(EVENTO));
  return registro.id;
}

export async function remover(id: string) {
  if (temSupabase) {
    const sb = getSupabase()!;
    const { data } = await sb.storage.from(BUCKET).list(id);
    if (data?.length) {
      await sb.storage.from(BUCKET).remove(data.map((a) => `${id}/${a.name}`));
    }
    const { error } = await sb.from("products").delete().eq("id", id);
    if (error) throw error;
    window.dispatchEvent(new Event(EVENTO));
    return;
  }

  const db = await abrir();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  window.dispatchEvent(new Event(EVENTO));
}

function paraProduto(registro: PublicacaoGravada): Produto {
  const midias: Midia[] = registro.midias.map((m, i) => ({
    tipo: m.tipo,
    url: URL.createObjectURL(m.blob),
    alt: `${registro.nome} — mídia ${i + 1}`,
  }));
  return {
    id: registro.id,
    nome: registro.nome,
    categoria: registro.categoria,
    preco: registro.preco,
    descricao: registro.descricao,
    tamanhos: registro.tamanhos,
    midias,
    criadoEm: registro.criadoEm,
  };
}

/** Lê as publicações da usuária (do banco próprio ou do aparelho) e reage a mudanças. */
export function useVitrine() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    try {
      if (temSupabase) {
        setProdutos(await lerDaNuvem());
        return;
      }
      const registros = await todas();
      registros.sort((a, b) => b.criadoEm - a.criadoEm);
      setProdutos((anteriores) => {
        anteriores.forEach((p) => p.midias.forEach((m) => URL.revokeObjectURL(m.url)));
        return registros.map(paraProduto);
      });
    } catch {
      setProdutos([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void recarregar();
    const ouvir = () => void recarregar();
    window.addEventListener(EVENTO, ouvir);
    return () => window.removeEventListener(EVENTO, ouvir);
  }, [recarregar]);

  return { produtos, carregando, recarregar };
}
