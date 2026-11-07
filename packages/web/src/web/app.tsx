import { Route, Switch } from "wouter";
import { Layout } from "./components/layout";
import { SiteRoutes } from "./components/site-routes";
import "./nova.css";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/alternativa" nest>
          <Layout menuStyle="portfolio">
            <SiteRoutes />
          </Layout>
        </Route>
        <Route>
          <Layout>
            <SiteRoutes />
          </Layout>
        </Route>
      </Switch>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      <RunableBadge />
    </Provider>
  );
}
export default App;
