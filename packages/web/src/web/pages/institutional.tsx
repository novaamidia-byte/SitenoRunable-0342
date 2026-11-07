import { Link } from "wouter";
import { ArrowUpRight, Mail, MessageCircle, Instagram } from "lucide-react";
import { useSettings } from "../queries/settings";
import { ContactCallout } from "../components/layout";
import { LoadingState, ErrorState } from "../components/portfolio";

export function About() {
  const q = useSettings();
  return (
    <>
      <section className="page-top wrap">
        <span className="eyebrow">SOBRE / NOVA MÍDIA</span>
        {q.isLoading ? (
          <LoadingState text="Carregando apresentação…" />
        ) : q.isError ? (
          <ErrorState onRetry={() => q.refetch()} />
        ) : (
          <>
            <h1>{q.data?.aboutTitle}</h1>
            <div className="about-body">
              <div className="about-type" aria-hidden="true">
                Estratégia.
                <br />
                Design.
                <br />
                Conteúdo.
              </div>
              <div>
                <p>{q.data?.aboutText}</p>
                <Link className="text-link" href="/projetos">
                  Conheça nosso trabalho <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </>
        )}
      </section>
      <section className="process-section wrap">
        <div className="section-heading">
          <span className="eyebrow">COMO TRABALHAMOS</span>
          <h2>Do briefing à entrega.</h2>
        </div>
        <div className="process-grid">
          {[
            { title: "Diagnóstico", text: "Entendemos seu negócio, público e objetivos." },
            { title: "Estratégia", text: "Definimos a mensagem, os canais e o plano visual." },
            { title: "Criação", text: "Design, vídeo e conteúdo produzidos com cuidado." },
            {
              title: "Acompanhamento",
              text: "Revisamos a comunicação e ajustamos quando necessário.",
            },
          ].map((p, i) => (
            <div key={p.title}>
              <span className="eyebrow">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>
      <ContactCallout />
    </>
  );
}
export function Contact() {
  const q = useSettings();
  const data = q.data;
  const available = data?.email || data?.whatsapp || data?.instagram;
  return (
    <section className="page-top contact-page wrap">
      <span className="eyebrow">CONTATO</span>
      <h1>
        Uma boa ideia
        <br />
        começa com
        <br />
        <span className="outlined-text">uma conversa.</span>
      </h1>
      <div className="contact-body">
        <p>
          Conte sobre a sua marca
          <br />e o que você precisa.
        </p>
        {q.isLoading ? (
          <LoadingState text="Carregando contatos…" />
        ) : q.isError ? (
          <ErrorState onRetry={() => q.refetch()} />
        ) : (
          <div className="contact-channels">
            {data?.email && (
              <a href={`mailto:${data.email}`}>
                <Mail size={22} />
                <span>{data.email}</span>
                <ArrowUpRight />
              </a>
            )}
            {data?.whatsapp && (
              <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noreferrer">
                <MessageCircle size={22} />
                <span>WhatsApp</span>
                <ArrowUpRight />
              </a>
            )}
            {data?.instagram && (
              <a href={data.instagram} target="_blank" rel="noreferrer">
                <Instagram size={22} />
                <span>Instagram</span>
                <ArrowUpRight />
              </a>
            )}
            {!available && (
              <div className="contact-unavailable">
                <span className="eyebrow">CANAIS DE CONTATO</span>
                <p>Os canais ainda não foram publicados.</p>
                <Link className="text-link" href="/projetos">
                  Explorar o portfólio <ArrowUpRight size={16} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
