import { useContext } from "react";
import { ClientContext } from "../context/client-context";

export const useClients = () => {
  const context = useContext(ClientContext);
  
  if (context === undefined) {
    throw new Error("useClients must be used within a ClientProvider");
  }
  
  return context;
};
