import { PRODUTOS, type Midia, type Produto, type CategoriaSlug } from "./catalog";

/**
 * Camada de dados da vitrine.
 *
 * Se as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY estiverem
 * configuradas, os produtos são lidos da tabela `produtos` do seu Supabase.
 * Caso contrário, o catálogo local (demonstração) é usado.
 *
 * Estrutura esperada da tabela `produtos`:
 *   id (text)            nome (text)          categoria (text: roupas|calcados|acessorios)
 *   preco (numeric)      preco_antigo (numeric, opcional)
 *   parcelas (int)       vendidos (int)       avaliacao (numeric)
 *   descricao (text)     tamanhos (text[])
 *   midias (jsonb)  ->  [{ "tipo": "imagem"|"video", "url": "...", "poster": "...", "alt": "..." }]
 */

const SUPABASE_URL = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
const SUPABASE_KEY = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string | undefined;

export const supabaseConfigurado = Boolean(SUPABASE_URL && SUPABASE_KEY);

type LinhaSupabase = {
  id: string;
  nome: string;
  categoria: string;
  preco: number | string;
  preco_antigo?: number | string | null;
  parcelas?: number | null;
  vendidos?: number | null;
  avaliacao?: number | string | null;
  descricao?: string | null;
  tamanhos?: string[] | null;
  midias?: Midia[] | null;
};

function normalizar(linha: LinhaSupabase): Produto {
  const categoria = (["roupas", "calcados", "acessorios"] as const).includes(
    linha.categoria as CategoriaSlug,
  )
    ? (linha.categoria as CategoriaSlug)
    : "roupas";

  return {
    id: String(linha.id),
    nome: linha.nome,
    categoria,
    preco: Number(linha.preco ?? 0),
    ...(linha.preco_antigo ? { precoAntigo: Number(linha.preco_antigo) } : {}),
    parcelas: Number(linha.parcelas ?? 6),
    vendidos: Number(linha.vendidos ?? 0),
    avaliacao: Number(linha.avaliacao ?? 5),
    descricao: linha.descricao ?? "",
    tamanhos: linha.tamanhos ?? ["Único"],
    midias: (linha.midias ?? []).filter((m) => m && m.url),
  };
}

export async function carregarProdutos(): Promise<Produto[]> {
  if (!supabaseConfigurado) return PRODUTOS;

  try {
    const resposta = await fetch(
      `${SUPABASE_URL}/rest/v1/produtos?select=*&order=vendidos.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY as string,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      },
    );
    if (!resposta.ok) throw new Error(`Supabase respondeu ${resposta.status}`);
    const linhas = (await resposta.json()) as LinhaSupabase[];
    const produtos = linhas.map(normalizar).filter((p) => p.midias.length > 0);
    return produtos.length > 0 ? produtos : PRODUTOS;
  } catch (erro) {
    console.warn("Não foi possível carregar produtos do Supabase, usando catálogo local.", erro);
    return PRODUTOS;
  }
}

export const produtosQueryOptions = {
  queryKey: ["produtos"] as const,
  queryFn: carregarProdutos,
  staleTime: 5 * 60 * 1000,
};
