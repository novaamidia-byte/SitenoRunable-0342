import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { useSettings } from "../queries/settings";
import { LoadingState, ErrorState } from "../components/portfolio";
import { ContactCallout } from "../components/layout";

const services = [
  {
    id: "identidade",
    category: "identidade-visual",
    title: "Identidade\n& branding",
    text: "Uma linguagem visual que organiza a essência da sua marca. Do posicionamento às aplicações, construímos uma identidade coerente em cada ponto de contato.",
    items: ["Identidade visual", "Branding", "Direção visual", "Aplicações da marca"],
    glyph: "Aa",
    label: "MARCA / EXPRESSÃO",
    className: "identity",
  },
  {
    id: "design",
    category: "design-grafico",
    title: "Design\n& comunicação",
    text: "Ideias traduzidas em peças claras e bem construídas. Materiais digitais e impressos pensados para comunicar sua mensagem com personalidade.",
    items: [
      "Design gráfico",
      "Materiais publicitários",
      "Design para campanhas",
      "Apresentações comerciais",
      "Design editorial",
      "Peças digitais",
    ],
    glyph: "D.",
    label: "FORMA / MENSAGEM",
    className: "graphic",
  },
  {
    id: "conteudo",
    category: "social-media",
    title: "Conteúdo\n& presença digital",
    text: "Planejamento e criação para manter a comunicação da sua marca consistente. Conteúdo, gestão de redes e marketing digital conectados à sua estratégia.",
    items: [
      "Social media",
      "Gestão de redes sociais",
      "Marketing digital",
      "Estratégia e planejamento de conteúdo",
      "Edição de vídeo",
    ],
    glyph: "↗",
    label: "CONTEÚDO / CONEXÃO",
    className: "content",
  },
];
export default function Services() {
  const q = useSettings();
  if (q.isLoading)
    return (
      <section className="section wrap">
        <LoadingState text="Carregando serviços…" />
      </section>
    );
  if (q.isError)
    return (
      <section className="section wrap">
        <ErrorState onRetry={() => q.refetch()} />
      </section>
    );
  const descriptions = [q.data?.identityText, q.data?.designText, q.data?.contentText];
  return (
    <>
      <section className="page-top wrap">
        <span className="eyebrow">O QUE FAZEMOS</span>
        <div className="page-title-row">
          <h1>
            Da ideia
            <br />à presença<span className="dot">.</span>
          </h1>
          <p>
            Três frentes criativas.
            <br />
            Uma comunicação que faz sentido.
          </p>
        </div>
      </section>
      <div className="wrap services-page">
        {services.map((s, i) => (
          <section key={s.id} id={s.id} className={`service-feature ${s.className}`}>
            <div className="service-art" aria-hidden="true">
              <span className="eyebrow">{s.label}</span>
              <strong>{s.glyph}</strong>
              <div className="art-guides" />
              <span className="eyebrow">DESIGN / NOVA MÍDIA</span>
            </div>
            <div className="service-content">
              <span className="eyebrow">0{i + 1} / ÁREAS DE ATUAÇÃO</span>
              <h2>
                {s.title.split("\n").map((l, j) => (
                  <span key={j}>{l}</span>
                ))}
              </h2>
              <p>{descriptions[i] || s.text}</p>
              <ul>
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className="text-link" href={`/projetos?categoria=${s.category}`}>
                Ver projetos desta área <ArrowUpRight size={18} />
              </Link>
            </div>
          </section>
        ))}
      </div>
      <ContactCallout />
    </>
  );
}
