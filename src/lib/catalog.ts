export type CategoriaSlug = "roupas" | "calcados" | "acessorios";

export type Midia =
  | { tipo: "imagem"; url: string; alt: string }
  | { tipo: "video"; url: string; poster?: string; alt: string };

export type Produto = {
  id: string;
  nome: string;
  categoria: CategoriaSlug;
  preco: number;
  descricao: string;
  tamanhos: string[];
  midias: Midia[];
  criadoEm: number;
};

export const CATEGORIAS: { slug: CategoriaSlug; nome: string; emoji: string }[] = [
  { slug: "roupas", nome: "Roupas", emoji: "👗" },
  { slug: "calcados", nome: "Calçados", emoji: "👟" },
  { slug: "acessorios", nome: "Acessórios", emoji: "👜" },
];

export const PIX = {
  chave: "11 97853-3338",
  chaveCopiavel: "11978533338",
  titular: "Vitorino Vitrines",
  banco: "Chave Pix (celular)",
  instrucoes: [
    "Copie a chave Pix e faça o pagamento no app do seu banco.",
    "Use o valor exato do produto escolhido.",
    "Envie o comprovante no WhatsApp com o nome do produto e o tamanho.",
    "Após a confirmação, o envio é combinado em até 1 dia útil.",
  ],
};

export const WHATSAPP = "5511978533338";

export function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function nomeCategoria(slug: CategoriaSlug) {
  return CATEGORIAS.find((c) => c.slug === slug)?.nome ?? slug;
}
