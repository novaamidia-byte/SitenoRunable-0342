import { Route, Switch, Link } from "wouter";
import Home from "../pages/home";
import Projects, { ProjectDetail } from "../pages/projects";
import Services from "../pages/services";
import { About, Contact } from "../pages/institutional";
import AuthPage from "../pages/auth";
import AdminPage from "../pages/admin";

/** Same pages for both menu variants; no duplicated content or administrative backend. */
export function SiteRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projetos" component={Projects} />
      <Route path="/projetos/:id">{(params) => <ProjectDetail id={params.id} />}</Route>
      <Route path="/servicos" component={Services} />
      <Route path="/sobre" component={About} />
      <Route path="/contato" component={Contact} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/admin" component={AdminPage} />
      <Route>
        <section className="not-found wrap">
          <span className="eyebrow">404</span>
          <h1>Página não encontrada.</h1>
          <Link className="text-link" href="/">
            Voltar ao início
          </Link>
        </section>
      </Route>
    </Switch>
  );
}
