"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, //data refetch time 60 seconds
            refetchOnWindowFocus: false, //If you switch tabs and come back → DON’T reload data
            retry: 1, //retry request only 1 time
          },
        },
      }),
  );
  // Wraps your whole app (children)
  // Gives access to data system everywhere
  // Adds toaster notifications
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster /> 
    </QueryClientProvider>
  );
}
