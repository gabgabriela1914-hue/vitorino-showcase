import camisa from "@/assets/p-camisa.jpg";
import vestido from "@/assets/p-vestido.jpg";
import jaqueta from "@/assets/p-jaqueta.jpg";
import tenis from "@/assets/p-tenis.jpg";
import sandalia from "@/assets/p-sandalia.jpg";
import bolsa from "@/assets/p-bolsa.jpg";
import oculos from "@/assets/p-oculos.jpg";
import relogio from "@/assets/p-relogio.jpg";
import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpg";
import banner3 from "@/assets/banner-3.jpg";

export type CategoriaSlug = "roupas" | "calcados" | "acessorios";

export type Midia =
  | { tipo: "imagem"; url: string; alt: string }
  | { tipo: "video"; url: string; poster?: string; alt: string };

export type Produto = {
  id: string;
  nome: string;
  categoria: CategoriaSlug;
  preco: number;
  precoAntigo?: number;
  parcelas: number;
  vendidos: number;
  avaliacao: number;
  descricao: string;
  tamanhos: string[];
  midias: Midia[];
};

export type Banner = {
  id: string;
  titulo: string;
  subtitulo: string;
  chamada: string;
  midia: Midia;
  destino: CategoriaSlug;
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

export const BANNERS: Banner[] = [
  {
    id: "b1",
    titulo: "Nova estação",
    subtitulo: "Alfaiataria leve e linho lavado",
    chamada: "Ver roupas",
    destino: "roupas",
    midia: { tipo: "imagem", url: banner1, alt: "Modelo com camisa de linho e calça alfaiataria" },
  },
  {
    id: "b2",
    titulo: "Passo firme",
    subtitulo: "Tênis e couros selecionados",
    chamada: "Ver calçados",
    destino: "calcados",
    midia: { tipo: "imagem", url: banner2, alt: "Calçados em pedestais de terracota" },
  },
  {
    id: "b3",
    titulo: "Detalhe que fecha",
    subtitulo: "Acessórios em couro, palha e dourado",
    chamada: "Ver acessórios",
    destino: "acessorios",
    midia: { tipo: "imagem", url: banner3, alt: "Cinto, relógio, óculos e bolsa de palha" },
  },
];

export const PRODUTOS: Produto[] = [
  {
    id: "camisa-linho",
    nome: "Camisa de Linho Areia",
    categoria: "roupas",
    preco: 189.9,
    precoAntigo: 249.9,
    parcelas: 6,
    vendidos: 312,
    avaliacao: 4.9,
    descricao:
      "Linho lavado com caimento solto, botões de madrepérola e bolso frontal. Peça leve para o calor, veste do P ao GG.",
    tamanhos: ["P", "M", "G", "GG"],
    midias: [
      { tipo: "imagem", url: camisa, alt: "Camisa de linho areia no cabide" },
      { tipo: "imagem", url: banner1, alt: "Camisa de linho vestida" },
    ],
  },
  {
    id: "vestido-midi",
    nome: "Vestido Midi Terracota",
    categoria: "roupas",
    preco: 259.0,
    parcelas: 8,
    vendidos: 148,
    avaliacao: 4.8,
    descricao:
      "Viscose fluida com decote transpassado, manga bufante e cintura elástica. Cai bem do dia à noite.",
    tamanhos: ["P", "M", "G"],
    midias: [{ tipo: "imagem", url: vestido, alt: "Vestido midi terracota no cabide" }],
  },
  {
    id: "jaqueta-jeans",
    nome: "Jaqueta Jeans Clássica",
    categoria: "roupas",
    preco: 279.0,
    precoAntigo: 329.0,
    parcelas: 8,
    vendidos: 421,
    avaliacao: 4.7,
    descricao:
      "Jeans médio com lavagem suave, bolsos com pala e ajuste na barra. Unissex, modelagem reta.",
    tamanhos: ["P", "M", "G", "GG"],
    midias: [{ tipo: "imagem", url: jaqueta, alt: "Jaqueta jeans clássica no cabide" }],
  },
  {
    id: "tenis-branco",
    nome: "Tênis Couro Branco",
    categoria: "calcados",
    preco: 329.0,
    parcelas: 10,
    vendidos: 587,
    avaliacao: 4.9,
    descricao:
      "Couro legítimo com forro respirável e solado de borracha antiderrapante. Numeração 34 ao 43.",
    tamanhos: ["35", "36", "37", "38", "39", "40", "41"],
    midias: [
      { tipo: "imagem", url: tenis, alt: "Tênis de couro branco" },
      { tipo: "imagem", url: banner2, alt: "Calçados em exposição" },
    ],
  },
  {
    id: "sandalia-couro",
    nome: "Sandália Couro Caramelo",
    categoria: "calcados",
    preco: 179.9,
    precoAntigo: 219.9,
    parcelas: 6,
    vendidos: 233,
    avaliacao: 4.6,
    descricao:
      "Tiras em couro caramelo, palmilha acolchoada e fivela metálica. Conforto para o dia inteiro.",
    tamanhos: ["34", "35", "36", "37", "38", "39"],
    midias: [{ tipo: "imagem", url: sandalia, alt: "Sandália de couro caramelo" }],
  },
  {
    id: "bolsa-palha",
    nome: "Bolsa de Palha Trançada",
    categoria: "acessorios",
    preco: 149.0,
    parcelas: 5,
    vendidos: 196,
    avaliacao: 4.8,
    descricao: "Palha natural trançada à mão, forro interno em algodão e alças reforçadas.",
    tamanhos: ["Único"],
    midias: [{ tipo: "imagem", url: bolsa, alt: "Bolsa de palha trançada" }],
  },
  {
    id: "oculos-sol",
    nome: "Óculos de Sol Acetato",
    categoria: "acessorios",
    preco: 129.9,
    parcelas: 4,
    vendidos: 364,
    avaliacao: 4.5,
    descricao: "Armação em acetato preto com lentes polarizadas UV400. Acompanha case e flanela.",
    tamanhos: ["Único"],
    midias: [{ tipo: "imagem", url: oculos, alt: "Óculos de sol de acetato preto" }],
  },
  {
    id: "relogio-dourado",
    nome: "Relógio Dourado Clássico",
    categoria: "acessorios",
    preco: 289.0,
    precoAntigo: 349.0,
    parcelas: 10,
    vendidos: 121,
    avaliacao: 4.7,
    descricao: "Caixa dourada com mostrador branco, pulseira em aço e resistência à água 3 ATM.",
    tamanhos: ["Único"],
    midias: [
      { tipo: "imagem", url: relogio, alt: "Relógio dourado com mostrador branco" },
      { tipo: "imagem", url: banner3, alt: "Acessórios em composição" },
    ],
  },
];

export function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function nomeCategoria(slug: CategoriaSlug) {
  return CATEGORIAS.find((c) => c.slug === slug)?.nome ?? slug;
}
