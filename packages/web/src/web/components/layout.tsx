import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, X, Lock } from "lucide-react";
import { nav, categories } from "../lib/content";
import { useSettings } from "../queries/settings";
import { PortfolioMenu } from "./portfolio-menu";

export function LogoSlot({ logo }: { logo?: string }) {
  return logo ? (
    <img className="official-logo" src={logo} alt="Nova Mídia" />
  ) : (
    <span className="logo-slot" aria-label="Espaço reservado para a logomarca oficial">
      <span>LOGOMARCA</span>
    </span>
  );
}
export function Header({ menuStyle = "original" }: { menuStyle?: "original" | "portfolio" }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const settings = useSettings();
  useEffect(() => {
    dialog.current?.close();
  }, [location]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const closeMenu = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <header className="header wrap">
        <Link href="/" aria-label="Nova Mídia — início">
          <LogoSlot logo={settings.data?.logo} />
        </Link>
        <span className="header-caption">ESTÚDIO CRIATIVO & PUBLICIDADE</span>
        <button
          ref={trigger}
          className="menu-trigger"
          aria-label="Abrir menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => {
            dialog.current?.showModal();
            setOpen(true);
          }}
        >
          <span>Menu</span>
          <Menu size={21} />
        </button>
      </header>
      {menuStyle === "portfolio" ? (
        <PortfolioMenu dialogRef={dialog} onClose={closeMenu} />
      ) : (
        <dialog
          ref={dialog}
          className="navigation-dialog"
          onClose={closeMenu}
          aria-label="Navegação principal"
        >
          <div className="menu-inner wrap">
            <div className="menu-head">
              <span className="eyebrow">NOVA MÍDIA / NAVEGAÇÃO</span>
              <button
                className="menu-trigger"
                onClick={() => dialog.current?.close()}
                aria-label="Fechar menu"
              >
                Fechar <X size={24} />
              </button>
            </div>
            <nav>
              {nav.map((item, i) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={location === item.path ? "current" : ""}
                  onClick={() => dialog.current?.close()}
                >
                  <span className="menu-index">0{i + 1}</span>
                  {item.title}
                  <ArrowUpRight />
                </Link>
              ))}
            </nav>
            <p className="menu-bottom">Design, estratégia e conteúdo.</p>
            <Link
              href={`/alternativa${location === "/" ? "" : location}`}
              className="menu-compare-link"
              onClick={() => dialog.current?.close()}
            >
              Comparar com o novo menu
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </dialog>
      )}
    </>
  );
}
export function Footer() {
  const { data } = useSettings();
  const footerNav = [nav[0]!, nav[2]!, nav[1]!, nav[3]!, nav[4]!];
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <LogoSlot logo={data?.logo} />
          <p>Estratégia, design e conteúdo para marcas que querem crescer com consistência.</p>
        </div>
        <nav aria-label="Rodapé">
          <h3>NAVEGAÇÃO</h3>
          {footerNav.map((n) => (
            <Link key={n.path} href={n.path}>
              {n.title}
            </Link>
          ))}
        </nav>
        <div>
          <h3>SERVIÇOS</h3>
          {categories.map((c) => (
            <Link key={c.slug} href={`/projetos?categoria=${c.slug}`}>
              {c.title}
            </Link>
          ))}
        </div>
        <div>
          <h3>CONTATO</h3>
          {data?.email && <a href={`mailto:${data.email}`}>{data.email}</a>}
          {data?.whatsapp && (
            <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          )}
          {data?.instagram && (
            <a href={data.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
        </div>
      </div>
      <div className="wrap footer-bottom">
        <p>© {new Date().getFullYear()} Nova Mídia. Todos os direitos reservados.</p>
        <Link href="/auth">
          <Lock size={13} /> Acesso da equipe
        </Link>
      </div>
    </footer>
  );
}
export function ContactCallout() {
  return (
    <section className="contact-callout">
      <div className="wrap">
        <div>
          <span className="eyebrow">PRÓXIMO PROJETO</span>
          <h2>
            Vamos criar
            <br />
            algo juntos?
          </h2>
        </div>
        <Link href="/contato" className="round-link" aria-label="Vamos conversar">
          <ArrowUpRight size={42} />
        </Link>
      </div>
    </section>
  );
}
export function Layout({
  children,
  menuStyle = "original",
}: {
  children: React.ReactNode;
  menuStyle?: "original" | "portfolio";
}) {
  const [location] = useLocation();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    else window.scrollTo(0, 0);
    document.title = `${nav.find((n) => n.path === location)?.title ?? "Projeto"} — Nova Mídia`;
  }, [location]);
  return (
    <>
      <Header menuStyle={menuStyle} />
      <main id="conteudo">{children}</main>
      <Footer />
    </>
  );
}
