
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import { AppLoader } from "@/components/AppLoader";
import NotFound from "./pages/NotFound";

// Lazy load the Index component
const Index = lazy(() => import("./pages/Index"));

const queryClient = new QueryClient();

// Get the base path for GitHub Pages deployment
const basename = import.meta.env.PROD ? '/pantone-palette-explorer' : '';

const App = () => {
  const [pantoneData, setPantoneData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleDataLoaded = (data: any) => {
    setPantoneData(data);
    // Small delay to show completion
    setTimeout(() => {
      setIsDataLoaded(true);
    }, 500);
  };

  if (!isDataLoaded) {
    return <AppLoader onDataLoaded={handleDataLoaded} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index preloadedData={pantoneData} />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
