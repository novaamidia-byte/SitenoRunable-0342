import type { RefObject } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, ArrowUpRight, X, Layers, PenTool, PanelsTopLeft } from "lucide-react";
import { categories } from "../lib/content";
import { useProjects } from "../queries/portfolio";
import "./portfolio-menu.css";

type Props = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
};

export function PortfolioMenu({ dialogRef, onClose }: Props) {
  const [location] = useLocation();
  const projects = useProjects();
  const featured = projects.data?.find((p) => p.featured) ?? projects.data?.[0];
  const close = () => dialogRef.current?.close();
  const studios = [
    { path: "/", title: "Início", description: "Um primeiro olhar sobre a Nova Mídia." },
    { path: "/sobre", title: "Sobre", description: "Nossa maneira de pensar e criar." },
    { path: "/contato", title: "Contato", description: "Vamos conversar sobre o seu projeto." },
  ];
  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="portfolio-menu-dialog"
      aria-label="Navegação principal — menu em colunas"
    >
      <div className="portfolio-menu-shell">
        <div className="portfolio-menu-top">
          <div>
            <span className="eyebrow">NOVA MÍDIA / NAVEGAÇÃO</span>
            <p>Encontre sua próxima perspectiva.</p>
          </div>
          <button
            type="button"
            className="portfolio-menu-close"
            aria-label="Fechar menu"
            onClick={close}
          >
            <span>Fechar</span>
            <X size={20} />
          </button>
        </div>
        <div className="portfolio-menu-grid">
          <div className="portfolio-menu-spotlight">
            <span className="eyebrow">UM OLHAR SOBRE O QUE CRIAMOS</span>
            <h2>
              Ideias.
              <br /> Formas.
              <br />
              <span>Perspectivas.</span>
            </h2>
            {projects.isLoading ? (
              <output className="portfolio-menu-status">Carregando portfólio…</output>
            ) : projects.isError ? (
              <p className="portfolio-menu-status">
                Acesse a página de projetos para carregar os trabalhos.
              </p>
            ) : featured ? (
              <Link
                href={`/projetos/${featured.id}`}
                className="portfolio-menu-featured"
                onClick={close}
              >
                <img src={featured.cover} alt={featured.title} />
                <span>
                  {featured.title}
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            ) : (
              <p className="portfolio-menu-status">Os trabalhos ainda não foram publicados.</p>
            )}
            <Link href="/projetos" className="portfolio-menu-primary" onClick={close}>
              Explorar portfólio
              <ArrowUpRight size={19} />
            </Link>
          </div>
          <nav
            className="portfolio-menu-column portfolio-menu-categories"
            aria-label="Portfólio por área"
          >
            <span className="portfolio-menu-label">PROJETOS POR ÁREA</span>
            <Link
              href="/projetos"
              className="portfolio-menu-all"
              aria-current={location === "/projetos" ? "page" : undefined}
              onClick={close}
            >
              Todos os projetos
              <ArrowUpRight size={16} />
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/projetos?categoria=${category.slug}`}
                onClick={close}
              >
                {category.short}
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </nav>
          <nav className="portfolio-menu-column portfolio-menu-services" aria-label="Serviços">
            <span className="portfolio-menu-label">O QUE FAZEMOS</span>
            {[
              {
                path: "/servicos#identidade",
                title: "Identidade & branding",
                description: "A essência da marca em uma linguagem visual.",
                Icon: Layers,
              },
              {
                path: "/servicos#design",
                title: "Design & comunicação",
                description: "Materiais que dão forma à sua mensagem.",
                Icon: PenTool,
              },
              {
                path: "/servicos#conteudo",
                title: "Conteúdo & social media",
                description: "Comunicação para a sua presença digital.",
                Icon: PanelsTopLeft,
              },
            ].map(({ path, title, description, Icon }) => (
              <Link className="portfolio-menu-service" href={path} key={path} onClick={close}>
                <span className="portfolio-menu-icon">
                  <Icon size={17} strokeWidth={1.5} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
              </Link>
            ))}
            <Link
              href="/servicos"
              className="portfolio-menu-textlink"
              aria-current={location === "/servicos" ? "page" : undefined}
              onClick={close}
            >
              Todos os serviços
              <ArrowRight size={15} />
            </Link>
          </nav>
          <nav
            className="portfolio-menu-column portfolio-menu-studio"
            aria-label="Conheça o estúdio"
          >
            <span className="portfolio-menu-label">CONHEÇA O ESTÚDIO</span>
            {studios.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={close}
                aria-current={location === item.path ? "page" : undefined}
              >
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </nav>
        </div>
        <div className="portfolio-menu-bottom">
          <div>
            <span className="eyebrow">TEM UM PROJETO EM MENTE?</span>
            <p>Vamos dar forma à sua ideia.</p>
          </div>
          <Link className="portfolio-menu-contact" href="/contato" onClick={close}>
            Vamos conversar
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="portfolio-menu-comparison">
          <span>Menu em colunas · versão alternativa</span>
          <Link href={`~${location || "/"}`} onClick={close}>
            Ver menu anterior
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </dialog>
  );
}
