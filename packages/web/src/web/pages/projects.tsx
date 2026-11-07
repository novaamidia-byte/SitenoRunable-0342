import { useState, useEffect } from "react";
import { useSearch, Link } from "wouter";
import { Search, ArrowUpRight, ArrowLeft } from "lucide-react";
import { categories, categoryName } from "../lib/content";
import { useProjects, useProject } from "../queries/portfolio";
import { ProjectGrid, EmptyPortfolio, ErrorState, LoadingState } from "../components/portfolio";
import { ContactCallout } from "../components/layout";

export default function Projects() {
  const search = useSearch();
  const initial = new URLSearchParams(search).get("categoria") ?? "";
  const [category, setCategory] = useState(initial);
  useEffect(() => {
    setCategory(new URLSearchParams(search).get("categoria") ?? "");
  }, [search]);
  const [term, setTerm] = useState("");
  const [order, setOrder] = useState("featured");
  const query = useProjects();
  const filtered = (query.data ?? [])
    .filter(
      (p) =>
        (!category || p.category === category) &&
        `${p.title} ${p.client} ${p.description}`
          .toLocaleLowerCase("pt-BR")
          .includes(term.toLocaleLowerCase("pt-BR")),
    )
    .sort((a, b) =>
      order === "old"
        ? a.createdAt - b.createdAt
        : order === "new"
          ? b.createdAt - a.createdAt
          : Number(b.featured) - Number(a.featured) || b.createdAt - a.createdAt,
    );
  const reset = () => {
    setCategory("");
    setTerm("");
  };
  return (
    <>
      <section className="page-top wrap">
        <span className="eyebrow">PORTFÓLIO / NOVA MÍDIA</span>
        <div className="page-title-row">
          <h1>
            Nosso trabalho<span className="dot">.</span>
          </h1>
          <p>
            Design, identidade e conteúdo.
            <br />
            Conheça cada projeto de perto.
          </p>
        </div>
      </section>
      <section className="portfolio-page wrap">
        <fieldset className="filter-tabs" aria-label="Categorias de projeto">
          <button className={!category ? "active" : ""} onClick={() => setCategory("")}>
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              className={category === c.slug ? "active" : ""}
              onClick={() => setCategory(c.slug)}
            >
              {c.short}
            </button>
          ))}
        </fieldset>
        <div className="search-row">
          <label>
            <Search size={17} />
            <input
              aria-label="Buscar projetos"
              placeholder="Buscar um projeto"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </label>
          <label className="order-label">
            Ordenar
            <select value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value="featured">Destaques</option>
              <option value="new">Mais recentes</option>
              <option value="old">Mais antigos</option>
            </select>
          </label>
        </div>
        {query.isLoading ? (
          <LoadingState />
        ) : query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : filtered.length ? (
          <ProjectGrid projects={filtered} />
        ) : (
          <EmptyPortfolio filtered={Boolean(category || term)} reset={reset} />
        )}
      </section>
      <ContactCallout />
    </>
  );
}
export function ProjectDetail({ id }: { id: string }) {
  const query = useProject(id);
  if (query.isLoading)
    return (
      <section className="section wrap">
        <LoadingState />
      </section>
    );
  if (query.isError || !query.data)
    return (
      <section className="section wrap">
        <h1 className="small-title">Projeto indisponível.</h1>
        <Link className="text-link" href="/projetos">
          Voltar ao portfólio <ArrowLeft size={16} />
        </Link>
      </section>
    );
  const p = query.data;
  return (
    <>
      <section className="page-top wrap">
        <Link className="text-link" href="/projetos">
          <ArrowLeft size={16} /> Todos os projetos
        </Link>
        <h1>{p.title}</h1>
        <div className="project-description">
          <span className="eyebrow">
            {categoryName(p.category)}
            {p.year && ` / ${p.year}`}
            {p.client && ` / ${p.client}`}
          </span>
          <p>{p.description}</p>
        </div>
      </section>
      <section className="wrap detail-media">
        <img src={p.cover} alt={p.title} />
        {p.media.map((m, i) =>
          m.type === "video" ? (
            <video
              key={i}
              src={m.url}
              aria-label={m.alt || `Vídeo do projeto ${p.title}`}
              controls
              preload="metadata"
            >
              <track
                kind="captions"
                src={m.captions || undefined}
                srcLang="pt-BR"
                label="Português"
              />
            </video>
          ) : (
            <img key={i} src={m.url} alt={m.alt || p.title} loading="lazy" />
          ),
        )}
        <Link className="text-link" href="/contato">
          Vamos conversar sobre o seu projeto <ArrowUpRight size={18} />
        </Link>
      </section>
      <ContactCallout />
    </>
  );
}
