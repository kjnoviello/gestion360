import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Work } from "../types/works";

const worksRef = collection(db, "works");

export const getWorks = async (): Promise<Work[]> => {
    const q = query(worksRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Work, "id">),
    }));
};

export const getWorkById = async (id: string): Promise<Work | null> => {
    const ref = doc(db, "works", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
        id: snap.id,
        ...(snap.data() as Omit<Work, "id">),
    };
};

export const getWorksByClient = async (clientId: string): Promise<Work[]> => {
    const q = query(
        worksRef,
        where("clientId", "==", clientId),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Work, "id">),
    }));
};

export const createWork = async (
    work: Omit<Work, "id" | "createdAt">
): Promise<string> => {
    const docRef = await addDoc(worksRef, {
        ...work,
        createdAt: Date.now(),
    });

    return docRef.id;
};

export const updateWorkById = async (
    id: string,
    data: Partial<Omit<Work, "id" | "createdAt">>
) => {
    const ref = doc(db, "works", id);
    await updateDoc(ref, data);
};

export const deleteWorkById = async (id: string) => {
    const ref = doc(db, "works", id);
    await deleteDoc(ref);
};
