import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Client } from "../types/clients";

const clientsRef = collection(db, "clients");

export const getClients = async (): Promise<Client[]> => {
    const q = query(clientsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Client, "id">),
    }));
};

export const getClientById = async (id: string): Promise<Client | null> => {
    const ref = doc(db, "clients", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
        id: snap.id,
        ...(snap.data() as Omit<Client, "id">),
    };
};

export const createClient = async (
    client: Omit<Client, "id" | "createdAt">
): Promise<string> => {
    const docRef = await addDoc(clientsRef, {
        ...client,
        createdAt: Date.now(),
    });

    return docRef.id;
};

export const updateClientById = async (
    id: string,
    data: Partial<Omit<Client, "id" | "createdAt">>
) => {
    const ref = doc(db, "clients", id);
    await updateDoc(ref, data);
};

export const deleteClientById = async (id: string) => {
    const ref = doc(db, "clients", id);
    await deleteDoc(ref);
};
