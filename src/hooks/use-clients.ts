import { useEffect, useState } from "react";
import {
  getClients,
  createClient,
  updateClientById,
  deleteClientById,
} from "../services/clients.service";
import { Client } from "../types/clients";

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClients()
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  const addClient = async (
    data: Omit<Client, "id" | "createdAt">
  ) => {
    const id = await createClient(data);
    setClients(prev => [
      { ...data, id, createdAt: Date.now() },
      ...prev,
    ]);
    return id;
  };

  const updateClient = async (
    id: string,
    data: Partial<Omit<Client, "id" | "createdAt">>
  ) => {
    await updateClientById(id, data);
    setClients(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const deleteClient = async (id: string) => {
    await deleteClientById(id);
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const getClient = (id: string) =>
    clients.find(c => c.id === id);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    getClient,
  };
};
