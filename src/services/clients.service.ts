import { supabase } from "../lib/supabase";
import { Client } from "../types/clients";

export const getClients = async (): Promise<Client[]> => {
    const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        company: c.company ?? undefined,
        address: c.address ?? undefined,
        createdAt: c.created_at,
    }));
};

export const getClientById = async (
    id: string
): Promise<Client | null> => {
    const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
    }

    return {
        id: data.id,
        name: data.name,
        phone: data.phone,
        company: data.company ?? undefined,
        address: data.address ?? undefined,
        createdAt: data.created_at,
    };
};

export const createClient = async (
    client: Omit<Client, "id" | "createdAt">
): Promise<string> => {
    const { data, error } = await supabase
        .from("clients")
        .insert({
            name: client.name,
            phone: client.phone,
            company: client.company ?? null,
            address: client.address ?? null,
            created_at: Date.now(),
        })
        .select("id")
        .single();

    if (error) throw error;

    return data.id;
};

export const updateClientById = async (
    id: string,
    data: Partial<Omit<Client, "id" | "createdAt">>
) => {
    const { error } = await supabase
        .from("clients")
        .update({
            ...data,
        })
        .eq("id", id);

    if (error) throw error;
};

export const deleteClientById = async (id: string) => {
    const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

    if (error) throw error;
};
