import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";
// import { Login } from "./components/Login";
// import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import PublicProjectTracker from "@/components/PublicProjectTracker";
import About from "./pages/About";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <div className="min-h-screen">
            <Navbar />
            <main className="py-10">
              <Routes>
                <Route path="/" element={<PublicProjectTracker />} />
                {/* <Route path="/login" element={<Login />} /> */}
                <Route path="/about" element={<About />} />
                <Route path="/game" element={<Game />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
