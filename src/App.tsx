
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from "@/lib/store";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Threats from "./pages/Threats";
import ThreatMap from "./pages/ThreatMap";
import Analytics from "./pages/Analytics";
import Network from "./pages/Network";
import Settings from "./pages/Settings";
import Siem from "./pages/Siem";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import { useEffect } from "react";
import { loginSuccess } from "@/features/auth/authSlice";

const queryClient = new QueryClient();

const App = () => {
  // Check for stored auth on load
  useEffect(() => {
    const storedAuth = localStorage.getItem('dashguard_auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        store.dispatch(loginSuccess(authData));
      } catch (error) {
        console.error('Failed to parse stored auth data', error);
        localStorage.removeItem('dashguard_auth');
      }
    }
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Protected routes inside Layout */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/threats" element={<Threats />} />
                <Route path="/map" element={<ThreatMap />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/network" element={<Network />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/siem" element={<Siem />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
