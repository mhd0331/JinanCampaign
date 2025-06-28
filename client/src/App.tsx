import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import PolicyDetail from "@/pages/PolicyDetail";
import CMSDashboard from "@/pages/CMSDashboard";
import CitizenSuggestions from "@/pages/CitizenSuggestions";
import NotFound from "@/pages/not-found";
import AccessibilityControls from "@/components/AccessibilityControls";
import FloatingHomeButton from "@/components/FloatingHomeButton";

function Router() {
  const [location] = useLocation();
  
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/policy/:policyId" component={PolicyDetail} />
        <Route path="/cms" component={CMSDashboard} />
        <Route path="/suggestions" component={CitizenSuggestions} />
        <Route component={NotFound} />
      </Switch>
      {/* 홈 페이지가 아닐 때만 플로팅 홈 버튼 표시 */}
      {location !== '/' && <FloatingHomeButton />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <a href="#main-content" className="skip-to-content">
          메인 콘텐츠로 건너뛰기
        </a>
        <div id="main-content">
          <Router />
        </div>
        <AccessibilityControls />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
