import { useCallback, useEffect, useState } from "react";
import type { CategoriaSlug, Midia, Produto } from "./catalog";

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

export async function publicar(dados: Omit<PublicacaoGravada, "id" | "criadoEm">) {
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

/** Lê as publicações da usuária e reage a novas publicações/remoções. */
export function useVitrine() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    try {
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
