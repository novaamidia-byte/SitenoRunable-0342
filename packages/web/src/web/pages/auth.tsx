import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Lock } from "lucide-react";
import { useInstallStatus, useSetup } from "../queries/administration";
import { LoadingState, ErrorState } from "../components/portfolio";
import { signIn } from "../lib/auth";

export default function AuthPage() {
  const status = useInstallStatus();
  const setup = useSetup();
  const [, navigate] = useLocation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [help, setHelp] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")),
      password = String(f.get("password"));
    try {
      if (!status.data?.installed)
        await setup.mutateAsync({
          email,
          password,
          key: String(f.get("key")),
          name: String(f.get("name")),
        });
      await signIn(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-page wrap">
      <div className="auth-intro">
        <span className="eyebrow">ACESSO DA EQUIPE</span>
        <h1>
          Nos bastidores
          <br />
          da criação.
        </h1>
        <p>Gerencie os projetos e as informações que dão vida ao portfólio da Nova Mídia.</p>
        <Link className="text-link inline-link" href="/projetos">
          Voltar ao portfólio <ArrowRight size={16} />
        </Link>
      </div>
      <div className="auth-card">
        {status.isLoading ? (
          <LoadingState text="Verificando acesso…" />
        ) : status.isError ? (
          <ErrorState onRetry={() => status.refetch()} />
        ) : (
          <>
            <h2>{status.data?.installed ? "Entrar" : "Configurar administração"}</h2>
            <form onSubmit={submit}>
              {!status.data?.installed && (
                <>
                  <label className="field">
                    Nome
                    <input
                      aria-label="Nome"
                      name="name"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </label>
                  <label className="field">
                    Chave de instalação
                    <input
                      aria-label="Chave de instalação"
                      name="key"
                      type="password"
                      autoComplete="off"
                      required
                    />
                    <small>
                      Validada exclusivamente no servidor. O cadastro fecha após a primeira conta.
                    </small>
                  </label>
                </>
              )}
              <label className="field">
                E-mail
                <input
                  aria-label="E-mail"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                />
              </label>
              <label className="field">
                Senha
                <input
                  aria-label="Senha"
                  name="password"
                  type="password"
                  autoComplete={status.data?.installed ? "current-password" : "new-password"}
                  required
                  minLength={12}
                />
                <small>{!status.data?.installed ? "Use pelo menos 12 caracteres." : ""}</small>
              </label>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <button className="primary-button" disabled={busy || setup.isPending}>
                {busy ? (
                  <>
                    <span className="spinner" /> Aguarde…
                  </>
                ) : (
                  <>
                    {status.data?.installed ? "Entrar" : "Criar primeira conta"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
            {status.data?.installed && (
              <>
                <button className="password-help" onClick={() => setHelp(!help)}>
                  Preciso recuperar meu acesso
                </button>
                {help && (
                  <p className="form-note">
                    A recuperação de acesso deve ser solicitada à equipe responsável pelo servidor.
                    Não há redefinição pública de senha.
                  </p>
                )}
              </>
            )}
            <p className="form-note">
              <Lock size={12} style={{ display: "inline", verticalAlign: "middle" }} /> Área
              restrita. Não há cadastro público.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
