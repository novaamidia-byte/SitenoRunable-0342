import { Link } from "wouter";
import { ArrowUpRight, ArrowRight, RotateCcw, Image } from "lucide-react";
import { categoryName } from "../lib/content";
import { useProjects } from "../queries/portfolio";
import type { AppRouterClient } from "../../api";

export type Project = Awaited<ReturnType<AppRouterClient["portfolio"]["list"]>>[number];
export function LoadingState({ text = "Carregando projetos…" }: { text?: string }) {
  return (
    <output className="loading-state">
      <span className="spinner" />
      {text}
    </output>
  );
}
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="error-state" role="alert">
      <p>Não foi possível carregar este conteúdo.</p>
      <button className="text-link" onClick={onRetry}>
        Tentar novamente <RotateCcw size={16} />
      </button>
    </div>
  );
}
export function EmptyPortfolio({
  filtered = false,
  reset,
}: {
  filtered?: boolean;
  reset?: () => void;
}) {
  return (
    <div className="portfolio-empty">
      <div className="empty-art" aria-hidden="true">
        <Image size={44} strokeWidth={1} />
        <span>PORTFÓLIO</span>
      </div>
      <div>
        <span className="eyebrow">{filtered ? "NENHUM RESULTADO" : "NOSSO TRABALHO"}</span>
        <h3>
          {filtered ? (
            "Nenhum projeto nesta seleção."
          ) : (
            <>
              Cada projeto,
              <br />
              uma nova perspectiva.
            </>
          )}
        </h3>
        <p>
          {filtered
            ? "Experimente outra categoria ou busca."
            : "Os trabalhos ainda não foram publicados."}
        </p>
        {filtered ? (
          <button className="text-link" onClick={reset}>
            Limpar filtros <ArrowRight size={16} />
          </button>
        ) : (
          <Link className="text-link" href="/contato">
            Converse sobre o seu projeto <ArrowUpRight size={17} />
          </Link>
        )}
      </div>
    </div>
  );
}
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="project-grid">
      {projects.map((p) => (
        <Link key={p.id} href={`/projetos/${p.id}`} className="project-card">
          <div className="project-cover">
            <img src={p.cover} alt={p.title} loading="lazy" />
            <span className="project-open">
              <ArrowUpRight />
            </span>
          </div>
          <div className="project-info">
            <h3>{p.title}</h3>
            <span>{categoryName(p.category)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function SelectedProjects() {
  const query = useProjects();
  const projects = query.data
    ? [...query.data].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 4)
    : [];
  return (
    <section className="section wrap" id="trabalhos">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PORTFÓLIO</span>
          <h2>
            Trabalhos em foco<span className="dot">.</span>
          </h2>
        </div>
        <Link href="/projetos" className="text-link">
          Todos os projetos <ArrowUpRight size={18} />
        </Link>
      </div>
      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : projects.length ? (
        <ProjectGrid projects={projects} />
      ) : (
        <EmptyPortfolio />
      )}
    </section>
  );
}
