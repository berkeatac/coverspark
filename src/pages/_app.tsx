import "../../styles/globals.css";
import {
  useMutation,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <Analytics />
    </QueryClientProvider>
  );
}
