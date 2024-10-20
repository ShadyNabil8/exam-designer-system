import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import Notifier from "./components/Notifier";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
      gcTime: 0,
      retry: false,
    },
  },
});
function App() {
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}></RouterProvider>
        </QueryClientProvider>
      </AuthProvider>
      <Notifier />
    </>
  );
}

export default App;
