import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import RoleSelection from "@/pages/RoleSelection";
import Help from "@/pages/Help";

function Router() {
  const { user, isLoading } = useAuth();
  const [showRoleSelection, setShowRoleSelection] = useState<boolean | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/help" component={Help} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  const needsRoleSelection = showRoleSelection !== false && !user.roleConfirmed;

  if (needsRoleSelection) {
    return (
      <RoleSelection 
        user={user} 
        onRoleSelected={() => setShowRoleSelection(false)} 
      />
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/help" component={Help} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
