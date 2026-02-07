import React, { createContext, useEffect, useState } from "react";
import { addToast } from "@heroui/react";

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  company: string;
  createdAt: number;
}

export interface Work {
  id: string;
  clientId: string;
  workDescription: string;
  date: string;
  budget: {
    amount: number;
    pdfUrl?: string;
    pdfName?: string;
  };
  photo?: string;
  photoName?: string;
  createdAt: number;
}

interface ClientContextType {
  clients: Client[];
  works: Work[];
  isLoading: boolean;
  addClient: (client: Omit<Client, "id" | "createdAt">) => Promise<string>;
  updateClient: (id: string, client: Partial<Omit<Client, "id" | "createdAt">>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClient: (id: string) => Client | undefined;
  addWork: (work: Omit<Work, "id" | "createdAt">) => Promise<string>;
  updateWork: (id: string, work: Partial<Omit<Work, "id" | "createdAt">>) => Promise<void>;
  deleteWork: (id: string) => Promise<void>;
  getWork: (id: string) => Work | undefined;
  getClientWorks: (clientId: string) => Work[];
  uploadFile: (file: File, type: "pdf" | "photo") => Promise<{ url: string; name: string }>;
}

export const ClientContext = createContext<ClientContextType>({
  clients: [],
  works: [],
  isLoading: true,
  addClient: async () => "",
  updateClient: async () => {},
  deleteClient: async () => {},
  getClient: () => undefined,
  addWork: async () => "",
  updateWork: async () => {},
  deleteWork: async () => {},
  getWork: () => undefined,
  getClientWorks: () => [],
  uploadFile: async () => ({ url: "", name: "" }),
});

interface ClientProviderProps {
  children: React.ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load clients and works from localStorage
    const savedClients = localStorage.getItem("clients");
    const savedWorks = localStorage.getItem("works");
    
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
    
    if (savedWorks) {
      setWorks(JSON.parse(savedWorks));
    }
    
    setIsLoading(false);
  }, []);

  // Save clients and works to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("clients", JSON.stringify(clients));
      localStorage.setItem("works", JSON.stringify(works));
    }
  }, [clients, works, isLoading]);

  const addClient = async (clientData: Omit<Client, "id" | "createdAt">): Promise<string> => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };

    setClients((prevClients) => [...prevClients, newClient]);
    
    addToast({
      title: "Cliente agregado",
      description: `${clientData.name} ha sido agregado correctamente`,
      color: "success",
    });
    
    return newClient.id;
  };

  const updateClient = async (id: string, clientData: Partial<Omit<Client, "id" | "createdAt">>): Promise<void> => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === id ? { ...client, ...clientData } : client
      )
    );
    
    addToast({
      title: "Cliente actualizado",
      description: "La información del cliente ha sido actualizada correctamente",
      color: "success",
    });
  };

  const deleteClient = async (id: string): Promise<void> => {
    const clientToDelete = clients.find(client => client.id === id);
    
    setClients((prevClients) => prevClients.filter((client) => client.id !== id));
    
    addToast({
      title: "Cliente eliminado",
      description: clientToDelete ? `${clientToDelete.name} ha sido eliminado` : "Cliente eliminado correctamente",
      color: "warning",
    });
  };

  const getClient = (id: string): Client | undefined => {
    return clients.find((client) => client.id === id);
  };

  const addWork = async (workData: Omit<Work, "id" | "createdAt">): Promise<string> => {
    const newWork: Work = {
      ...workData,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };

    setWorks((prevWorks) => [...prevWorks, newWork]);
    
    addToast({
      title: "Trabajo agregado",
      description: "El trabajo ha sido agregado correctamente",
      color: "success",
    });
    
    return newWork.id;
  };

  const updateWork = async (id: string, workData: Partial<Omit<Work, "id" | "createdAt">>): Promise<void> => {
    setWorks((prevWorks) =>
      prevWorks.map((work) =>
        work.id === id ? { ...work, ...workData } : work
      )
    );
    
    addToast({
      title: "Trabajo actualizado",
      description: "La información del trabajo ha sido actualizada correctamente",
      color: "success",
    });
  };

  const deleteWork = async (id: string): Promise<void> => {
    setWorks((prevWorks) => prevWorks.filter((work) => work.id !== id));
    
    addToast({
      title: "Trabajo eliminado",
      description: "El trabajo ha sido eliminado correctamente",
      color: "warning",
    });
  };

  const getWork = (id: string): Work | undefined => {
    return works.find((work) => work.id === id);
  };

  const getClientWorks = (clientId: string): Work[] => {
    return works.filter((work) => work.clientId === clientId);
  };

  const uploadFile = async (file: File, type: "pdf" | "photo"): Promise<{ url: string; name: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real app, you would upload to a server/storage service
        // For this example, we'll use base64 data URLs
        resolve({
          url: reader.result as string,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        works,
        isLoading,
        addClient,
        updateClient,
        deleteClient,
        getClient,
        addWork,
        updateWork,
        deleteWork,
        getWork,
        getClientWorks,
        uploadFile,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};