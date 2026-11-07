import { useState, useRef } from "react";
import { Redirect, Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, LogOut, Pencil, Trash2, Eye, EyeOff, Image, ArrowUpRight } from "lucide-react";
import { useAdmin } from "../queries/administration";
import { useAdminProjects, useRemoveProject, useToggleProject } from "../queries/portfolio";
import { authClient, clearToken } from "../lib/auth";
import { categoryName } from "../lib/content";
import { LoadingState, ErrorState, type Project } from "../components/portfolio";
import { ProjectEditor } from "../components/project-editor";
import { SettingsEditor } from "../components/settings-editor";

function Dashboard({ name }: { name: string }) {
  const [tab, setTab] = useState("projects");
  const [editor, setEditor] = useState<Project | "new" | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const query = useAdminProjects();
  const remove = useRemoveProject();
  const toggle = useToggleProject();
  const dialog = useRef<HTMLDialogElement>(null);
  const qc = useQueryClient();
  const [, navigate] = useLocation();
  async function logout() {
    setSigningOut(true);
    await authClient.signOut();
    clearToken();
    qc.clear();
    navigate("/auth");
  }
  async function confirmDelete() {
    if (!deleting) return;
    try {
      await remove.mutateAsync({ id: deleting.id, confirmation: true });
      dialog.current?.close();
      setDeleting(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível excluir.");
      dialog.current?.close();
    }
  }
  return (
    <section className="admin-page wrap">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">NOVA MÍDIA / ADMINISTRAÇÃO</span>
          <h1>Seu portfólio.</h1>
          <p>Olá, {name}. Gerencie o que aparece no site.</p>
        </div>
        <div className="admin-actions">
          <Link href="/projetos" className="secondary-button">
            Ver site <ArrowUpRight size={16} />
          </Link>
          <button className="secondary-button" onClick={logout} disabled={signingOut}>
            <LogOut size={15} />
            {signingOut ? "Saindo…" : "Sair"}
          </button>
        </div>
      </div>
      <div className="admin-tabs">
        <button
          className={tab === "projects" ? "active" : ""}
          onClick={() => {
            setTab("projects");
            setEditor(null);
          }}
        >
          Projetos
        </button>
        <button
          className={tab === "content" ? "active" : ""}
          onClick={() => {
            setTab("content");
            setEditor(null);
          }}
        >
          Conteúdo & contatos
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {tab === "content" ? (
        <SettingsEditor />
      ) : editor ? (
        <ProjectEditor
          project={editor === "new" ? undefined : editor}
          onClose={() => setEditor(null)}
        />
      ) : (
        <>
          {query.isLoading ? (
            <LoadingState />
          ) : query.isError ? (
            <ErrorState onRetry={() => query.refetch()} />
          ) : !query.data?.length ? (
            <div className="admin-empty">
              <Image size={36} style={{ margin: "auto" }} strokeWidth={1} />
              <h2>O próximo trabalho começa aqui.</h2>
              <p>Cadastre um projeto real para apresentá-lo no portfólio.</p>
              <button className="primary-button" onClick={() => setEditor("new")}>
                <Plus size={17} /> Cadastrar primeiro projeto
              </button>
            </div>
          ) : (
            <>
              <button
                className="primary-button"
                style={{ marginBottom: 22 }}
                onClick={() => setEditor("new")}
              >
                <Plus size={16} /> Novo projeto
              </button>
              <div className="admin-table">
                {query.data.map((p) => (
                  <div className="admin-project" key={p.id}>
                    {p.cover ? (
                      <img src={p.cover} alt="" className="admin-thumb" />
                    ) : (
                      <div className="admin-thumb">
                        <Image size={20} />
                      </div>
                    )}
                    <div className="admin-project-info">
                      <h3>{p.title}</h3>
                      <p>
                        {categoryName(p.category)} · {p.active ? "Publicado" : "Rascunho"}
                        {p.featured ? " · Destaque" : ""}
                      </p>
                    </div>
                    <div className="admin-project-buttons">
                      <button className="icon-button" onClick={() => setEditor(p)}>
                        <Pencil size={14} /> Editar
                      </button>
                      <button
                        className="icon-button"
                        disabled={toggle.isPending}
                        onClick={() => {
                          setError("");
                          toggle.mutate(
                            { id: p.id, active: !p.active },
                            { onError: (e) => setError(e.message) },
                          );
                        }}
                      >
                        {p.active ? <EyeOff size={14} /> : <Eye size={14} />}
                        {p.active ? "Desativar" : "Publicar"}
                      </button>
                      <button
                        className="icon-button danger"
                        onClick={() => {
                          setDeleting(p);
                          dialog.current?.showModal();
                        }}
                        aria-label={`Excluir ${p.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
      <dialog ref={dialog} className="delete-dialog" aria-label="Confirmar exclusão">
        <h2>Excluir projeto?</h2>
        <p>
          O projeto “{deleting?.title}” será removido do portfólio e do cadastro. Esta ação não pode
          ser desfeita.
        </p>
        <div className="editor-footer">
          <button
            className="secondary-button"
            onClick={() => dialog.current?.close()}
            disabled={remove.isPending}
          >
            Cancelar
          </button>
          <button
            className="primary-button"
            style={{ background: "#9c2929", borderColor: "#9c2929" }}
            onClick={confirmDelete}
            disabled={remove.isPending}
          >
            {remove.isPending ? "Excluindo…" : "Excluir projeto"}
          </button>
        </div>
      </dialog>
    </section>
  );
}
export default function AdminPage() {
  const q = useAdmin();
  if (q.isLoading)
    return (
      <section className="section wrap">
        <LoadingState text="Verificando permissão…" />
      </section>
    );
  if (q.isError) {
    if ("code" in q.error && (q.error.code === "UNAUTHORIZED" || q.error.code === "FORBIDDEN"))
      return <Redirect to="/auth" />;
    return (
      <section className="section wrap">
        <ErrorState onRetry={() => q.refetch()} />
      </section>
    );
  }
  if (!q.data) return <Redirect to="/auth" />;
  return <Dashboard name={q.data.name} />;
}
