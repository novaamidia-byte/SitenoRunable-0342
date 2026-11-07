import { useState } from "react";
import { Save } from "lucide-react";
import { useSettings, useSaveSettings } from "../queries/settings";
import { LoadingState, ErrorState } from "./portfolio";
import { MediaUpload } from "./media-upload";
import type { AppRouterClient } from "../../api";

type Settings = Awaited<ReturnType<AppRouterClient["settings"]["get"]>>;
function Form({ initial }: { initial: Settings }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const save = useSaveSettings();
  const update = (key: keyof Settings, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setMessage("");
  };
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await save.mutateAsync(form);
      setMessage("Conteúdo atualizado no site.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    }
  }
  return (
    <form className="editor settings-form" onSubmit={submit}>
      <div className="editor-head">
        <h2>Conteúdo & contatos</h2>
      </div>
      <label className="field">
        Título da página inicial
        <textarea
          aria-label="Título da página inicial"
          maxLength={100}
          required
          value={form.heroTitle}
          onChange={(e) => update("heroTitle", e.target.value)}
        />
        <small>Use uma quebra de linha para a composição editorial.</small>
      </label>
      <label className="field">
        Texto de abertura
        <textarea
          aria-label="Texto de abertura"
          required
          maxLength={400}
          value={form.heroText}
          onChange={(e) => update("heroText", e.target.value)}
        />
      </label>
      <label className="field">
        Título institucional
        <input
          aria-label="Título institucional"
          required
          maxLength={120}
          value={form.aboutTitle}
          onChange={(e) => update("aboutTitle", e.target.value)}
        />
      </label>
      <label className="field">
        Apresentação institucional
        <textarea
          aria-label="Apresentação institucional"
          required
          maxLength={3000}
          value={form.aboutText}
          onChange={(e) => update("aboutText", e.target.value)}
        />
      </label>
      <span className="eyebrow" style={{ marginBottom: 20 }}>
        DESCRIÇÕES DOS SERVIÇOS
      </span>
      {(
        [
          { key: "identityText", label: "Identidade & branding" },
          { key: "designText", label: "Design & comunicação" },
          { key: "contentText", label: "Conteúdo & presença digital" },
        ] as const
      ).map((item) => (
        <label className="field" key={item.key}>
          {item.label}
          <textarea
            aria-label={item.label}
            required
            minLength={20}
            maxLength={1200}
            value={form[item.key]}
            onChange={(e) => update(item.key, e.target.value)}
          />
        </label>
      ))}
      <div className="form-grid">
        <label className="field">
          E-mail público
          <input
            aria-label="E-mail público"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </label>
        <label className="field">
          WhatsApp
          <input
            aria-label="WhatsApp"
            placeholder="Código do país + DDD + número"
            value={form.whatsapp}
            pattern="[1-9][0-9]{7,14}|"
            onChange={(e) => update("whatsapp", e.target.value)}
          />
          <small>Somente números; exemplo de formato: 55 + DDD + telefone.</small>
        </label>
        <label className="field full-width">
          Instagram
          <input
            aria-label="Instagram"
            type="url"
            placeholder="https://www.instagram.com/…"
            value={form.instagram}
            onChange={(e) => update("instagram", e.target.value)}
          />
        </label>
        <label className="field full-width">
          Logomarca oficial
          <input
            aria-label="Logomarca oficial"
            type="url"
            placeholder="https://… ou envie abaixo"
            value={form.logo}
            onChange={(e) => update("logo", e.target.value)}
          />
          <small>
            Deixe vazio para manter o espaço reservado. PNG transparente funciona em fundos claros e
            escuros.
          </small>
        </label>
      </div>
      {form.logo && <img src={form.logo} className="upload-preview" alt="Logomarca oficial" />}
      <MediaUpload
        imagesOnly
        label="Enviar logomarca oficial"
        onUpload={(url) => update("logo", url)}
      />
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {message && <output className="form-success">{message}</output>}
      <button className="primary-button" disabled={save.isPending}>
        {save.isPending ? <span className="spinner" /> : <Save size={16} />}
        {save.isPending ? "Salvando…" : "Salvar conteúdo"}
      </button>
    </form>
  );
}
export function SettingsEditor() {
  const q = useSettings();
  if (q.isLoading) return <LoadingState text="Carregando conteúdo…" />;
  if (q.isError || !q.data) return <ErrorState onRetry={() => q.refetch()} />;
  return <Form initial={q.data} />;
}
