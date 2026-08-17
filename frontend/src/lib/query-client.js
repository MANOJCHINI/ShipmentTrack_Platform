import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
export const queryKeys = {
  shipments: ["shipments"],
  shipment: (id) => ["shipments", id],
  myShipments: (customerId) => ["shipments", "mine", customerId],
  
  notifications: ["notifications"],
  tickets: ["tickets"],
  ticket: (id) => ["tickets", id],
  team: ["team"],
  
  analytics: ["analytics"],
 
  routes: ["routes"],
  podRecords: ["podRecords"],
  
  reports: ["reports"],
  
};
