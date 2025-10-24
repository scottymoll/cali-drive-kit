import { Toaster } from "@/components/ui/toaster"; 
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import ClientOnly from "@/components/ClientOnly";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BasicCheckout from "./pages/checkout/basic";
import PremiumCheckout from "./pages/checkout/premium";
import { useURLValidation } from "@/hooks/use-url-validation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

const RoutesWithValidation = () => {
  const { isValid, error, isChecking } = useURLValidation();

  // Show loading state while checking URL validity
  if (isChecking) {
    return <LoadingSkeleton />;
  }

  // If URL is invalid, show error
  if (!isValid && error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-destructive text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Navigation Error
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {error}
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-pacific-500 text-white px-6 py-3 rounded-md hover:bg-pacific-600 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <ClientOnly fallback={<LoadingSkeleton />}>
          <Index />
        </ClientOnly>
      } />
      <Route path="/checkout/basic" element={<BasicCheckout />} />
      <Route path="/checkout/premium" element={<PremiumCheckout />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RoutesWithValidation />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
