import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Meetings from "./pages/Meetings";
import Proposals from "./pages/Proposals";
import Knowledge from "./pages/Knowledge";
import Settings from "./pages/Settings";
import Workflows from "./pages/Workflows";
import Analytics from "./pages/Analytics";
import Collaboration from "./pages/Collaboration";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/hooks/use-auth";
import { AuditLogProvider } from "@/hooks/use-audit-log";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AuditLogProvider>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/meetings" element={<Meetings />} />
                    <Route path="/proposals" element={<Proposals />} />
                    <Route path="/knowledge" element={<Knowledge />} />
                    <Route path="/workflows" element={<Workflows />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/collaboration" element={<Collaboration />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </AuditLogProvider>
            </AuthProvider>
          </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
