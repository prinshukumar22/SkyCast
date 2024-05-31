"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app";

export default function Home() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <App></App>
    </QueryClientProvider>
  );
}
