import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import Collection from "@/pages/Collection";
import UserSelection from "@/pages/UserSelection";
import NotFound from "@/pages/not-found";
import { getCurrentUser } from "./lib/storage";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const user = getCurrentUser();
  if (!user) return <Redirect to="/select-user" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/select-user" component={UserSelection} />
      <Route path="/">
        {() => <ProtectedRoute component={Home} />}
      </Route>
      <Route path="/game">
        {() => <ProtectedRoute component={Game} />}
      </Route>
      <Route path="/collection">
        {() => <ProtectedRoute component={Collection} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

// Get base path from Vite config (for GitHub Pages deployment)
const base = import.meta.env.BASE_URL;

function App() {
  return (
    <WouterRouter base={base.endsWith("/") ? base.slice(0, -1) : base}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </WouterRouter>
  );
}

export default App;
