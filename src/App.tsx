import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";
import { AppLoader } from "@/components/AppLoader";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/ThemeProvider";

// Lazy load the Index component
const Index = lazy(() => import("./pages/Index"));

const queryClient = new QueryClient();

// Get the base path for GitHub Pages deployment
const basename = import.meta.env.PROD ? '/pantone-palette-explorer' : '';

const App = () => {
  const [pantoneData, setPantoneData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  console.log('App component rendering, isDataLoaded:', isDataLoaded);
  console.log('Pantone data length:', pantoneData ? pantoneData.length : 'null');

  useEffect(() => {
    console.log('App component mounted');
  }, []);

  const handleDataLoaded = (data: any) => {
    console.log('Data loaded in App component:', data ? data.length : 'null', 'colors');
    setPantoneData(data);
    // Small delay to show completion
    setTimeout(() => {
      console.log('Setting isDataLoaded to true');
      setIsDataLoaded(true);
    }, 500);
  };

  if (!isDataLoaded) {
    console.log('Showing AppLoader');
    return <AppLoader onDataLoaded={handleDataLoaded} />;
  }

  console.log('Rendering main app with router');

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={basename}>
            <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"><div className="text-gray-600">Initializing...</div></div>}>
              <Routes>
                <Route path="/" element={<Index preloadedData={pantoneData} />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
