import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import PolicyDetail from "@/pages/PolicyDetail";
import CMSDashboard from "@/pages/CMSDashboard";
import CitizenSuggestions from "@/pages/CitizenSuggestions";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/policy/:policyId" component={PolicyDetail} />
      <Route path="/cms" component={CMSDashboard} />
      <Route path="/suggestions" component={CitizenSuggestions} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
