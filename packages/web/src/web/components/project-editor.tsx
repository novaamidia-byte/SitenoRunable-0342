import { useState } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { categories } from "../lib/content";
import { useSaveProject } from "../queries/portfolio";
import { MediaUpload } from "./media-upload";
import type { Project } from "./portfolio";

const empty = {
  title: "",
  category: "design-grafico" as const,
  description: "",
  client: "",
  year: "",
  cover: "",
  media: [] as Project["media"],
  active: false,
  featured: false,
};
export function ProjectEditor({ project, onClose }: { project?: Project; onClose: () => void }) {
  const [form, setForm] = useState(project ? { ...project } : empty);
  const [error, setError] = useState("");
  const save = useSaveProject();
  const update = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await save.mutateAsync({ ...form, category: form.category as "design-grafico" });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar projeto.");
    }
  }
  return (
    <form className="editor" onSubmit={submit}>
      <div className="editor-head">
        <h2>{project ? "Editar projeto" : "Novo projeto"}</h2>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar editor">
          <X size={18} />
        </button>
      </div>
      <div className="form-grid">
        <label className="field">
          Título
          <input
            aria-label="Título"
            required
            minLength={2}
            maxLength={180}
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </label>
        <label className="field">
          Categoria
          <select
            aria-label="Categoria"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            {categories.map((c) => (
              <option value={c.slug} key={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Cliente (opcional)
          <input
            aria-label="Cliente (opcional)"
            maxLength={150}
            value={form.client}
            onChange={(e) => update("client", e.target.value)}
          />
        </label>
        <label className="field">
          Ano (opcional)
          <input
            aria-label="Ano (opcional)"
            maxLength={4}
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
          />
        </label>
        <label className="field full-width">
          Descrição do projeto
          <textarea
            aria-label="Descrição do projeto"
            required
            minLength={10}
            maxLength={12000}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </label>
        <div className="full-width">
          <label className="field">
            Imagem de capa
            <input
              aria-label="Imagem de capa"
              type="url"
              placeholder="https://… ou envie um arquivo abaixo"
              value={form.cover}
              onChange={(e) => update("cover", e.target.value)}
            />
            <small>A capa é obrigatória para publicar. URLs devem usar HTTPS.</small>
          </label>
          {form.cover && <img className="upload-preview" src={form.cover} alt="Prévia da capa" />}
          <MediaUpload imagesOnly label="Enviar capa" onUpload={(url) => update("cover", url)} />
          <span className="eyebrow">GALERIA DO PROJETO</span>
          <MediaUpload
            label="Adicionar imagem ou vídeo"
            onUpload={(url, type, name) =>
              setForm((f) => ({ ...f, media: [...f.media, { url, type, alt: name }] }))
            }
          />
          <div className="media-list">
            {form.media.map((m, i) => (
              <div className="media-item" key={i}>
                {m.type === "image" ? (
                  <img src={m.url} alt={m.alt} />
                ) : (
                  <video
                    src={m.url}
                    aria-label={m.alt || "Prévia do vídeo"}
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
                )}
                <input
                  aria-label={`Descrição da mídia ${i + 1}`}
                  placeholder="Descrição acessível"
                  value={m.alt}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      media: f.media.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)),
                    }))
                  }
                />
                {m.type === "video" && (
                  <input
                    type="url"
                    aria-label={`URL de legendas da mídia ${i + 1}`}
                    placeholder="Legendas WebVTT: https://… (opcional)"
                    value={m.captions ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        media: f.media.map((x, j) =>
                          j === i ? { ...x, captions: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                )}
                <button
                  className="icon-button danger"
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, media: f.media.filter((_, j) => i !== j) }))
                  }
                >
                  <Trash2 size={13} /> Remover da galeria
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <label className="checkbox-field">
              <input
                aria-label="Publicar no site"
                type="checkbox"
                checked={form.active}
                onChange={(e) => update("active", e.target.checked)}
              />{" "}
              Publicar no site
            </label>
            <label className="checkbox-field">
              <input
                aria-label="Destaque na página inicial"
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
              />{" "}
              Destaque na página inicial
            </label>
          </div>
        </div>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="editor-footer">
        <button className="primary-button" disabled={save.isPending}>
          {save.isPending ? <span className="spinner" /> : <Save size={16} />}
          {save.isPending ? "Salvando…" : "Salvar projeto"}
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
          disabled={save.isPending}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
