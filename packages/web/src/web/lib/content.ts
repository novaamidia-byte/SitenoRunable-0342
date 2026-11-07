export const categories = [
  { slug: "design-grafico", title: "Design Gráfico", short: "Design" },
  { slug: "social-media", title: "Social Media", short: "Social media" },
  {
    slug: "identidade-visual",
    title: "Identidade Visual e Branding",
    short: "Identidade & branding",
  },
  { slug: "edicao-de-video", title: "Edição de Vídeo", short: "Vídeo" },
  { slug: "marketing-digital", title: "Marketing Digital", short: "Marketing digital" },
  { slug: "outros-servicos", title: "Outros Serviços", short: "Outros" },
];
export const nav = [
  { title: "Início", path: "/" },
  { title: "Serviços", path: "/servicos" },
  { title: "Projetos", path: "/projetos" },
  { title: "Sobre", path: "/sobre" },
  { title: "Contato", path: "/contato" },
];
export const categoryName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.title ?? slug;
