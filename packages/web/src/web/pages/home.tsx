import { Link } from "wouter";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { useSettings } from "../queries/settings";
import { SelectedProjects, LoadingState, ErrorState } from "../components/portfolio";
import { ContactCallout } from "../components/layout";

export default function Home() {
  const settings = useSettings();
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-meta">
            <span className="eyebrow">NOVA MÍDIA — ESTÚDIO CRIATIVO</span>
            <span className="eyebrow">DESIGN / ESTRATÉGIA / CONTEÚDO</span>
          </div>
          <div className="hero-grid">
            <div className="hero-main">
              {settings.isLoading ? (
                <LoadingState text="Carregando…" />
              ) : settings.isError ? (
                <ErrorState onRetry={() => settings.refetch()} />
              ) : (
                <>
                  <h1>
                    {settings.data?.heroTitle.split("\n").map((line, i) => (
                      <span key={i} className={i === 1 ? "highlight-line" : ""}>
                        {line}
                      </span>
                    ))}
                  </h1>
                  <div className="hero-baseline">
                    <p>{settings.data?.heroText}</p>
                    <a className="round-link" href="#trabalhos" aria-label="Explorar portfólio">
                      <ArrowDown size={26} />
                    </a>
                  </div>
                </>
              )}
            </div>
            <div
              className="type-composition"
              aria-label="Composição tipográfica representando design e identidade, não um projeto de cliente"
            >
              <div className="type-top">
                <span>FORMA & EXPRESSÃO</span>
                <ArrowUpRight size={20} />
              </div>
              <div className="type-glyph">
                Aa
                <span className="type-cross cross-one" />
                <span className="type-cross cross-two" />
              </div>
              <div className="type-bottom">
                <span>
                  Do conceito
                  <br />à identidade.
                </span>
                <div className="color-swatches">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </div>
          <div className="hero-services">
            <span className="eyebrow">O QUE CRIAMOS</span>
            <Link href="/servicos#identidade">
              Identidade & branding <ArrowUpRight size={17} />
            </Link>
            <Link href="/servicos#design">
              Design gráfico <ArrowUpRight size={17} />
            </Link>
            <Link href="/servicos#conteudo">
              Conteúdo & social media <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <SelectedProjects />
      <section className="services-intro section wrap">
        <div>
          <span className="eyebrow">O QUE FAZEMOS</span>
          <h2>
            Uma ideia.
            <br />
            Muitas possibilidades.
          </h2>
          <p>Da identidade da marca aos materiais que colocam a sua mensagem no mundo.</p>
          <Link href="/servicos" className="text-link">
            Conheça nossos serviços <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="service-list">
          <Link href="/servicos#identidade">
            <span>Identidade visual & branding</span>
            <ArrowUpRight />
          </Link>
          <Link href="/servicos#design">
            <span>Design & comunicação</span>
            <ArrowUpRight />
          </Link>
          <Link href="/servicos#conteudo">
            <span>Conteúdo & presença digital</span>
            <ArrowUpRight />
          </Link>
        </div>
      </section>
      <section className="about-preview">
        <div className="wrap">
          <span className="eyebrow">SOBRE A NOVA MÍDIA</span>
          <div>
            <h2>{settings.data?.aboutTitle ?? "Criatividade com propósito."}</h2>
            <p>{settings.data?.aboutText}</p>
            <Link href="/sobre" className="text-link">
              Conheça a agência <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <ContactCallout />
    </>
  );
}
