import { useCallback, useEffect, useState } from "react";
import {
    getWorks,
    createWork,
    updateWorkById,
    deleteWorkById,
} from "../services/works.service";
import { Work } from "../types/works";

export const useWorks = () => {
    const [works, setWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getWorks()
            .then(setWorks)
            .finally(() => setLoading(false));
    }, []);

    const addWork = async (
        data: Omit<Work, "id" | "createdAt">
    ) => {
        const id = await createWork(data);
        setWorks(prev => [
            { ...data, id, createdAt: Date.now() },
            ...prev,
        ]);
        return id;
    };

    const updateWork = async (
        id: string,
        data: Partial<Omit<Work, "id" | "createdAt">>
    ) => {
        await updateWorkById(id, data);
        setWorks(prev =>
            prev.map(w => (w.id === id ? { ...w, ...data } : w))
        );
    };

    const deleteWork = async (id: string) => {
        await deleteWorkById(id);
        setWorks(prev => prev.filter(w => w.id !== id));
    };

    const getWork = (id: string) =>
        works.find(w => w.id === id);

    const getWorkById = useCallback(
        (id: string) => works.find(w => w.id === id),
        [works]
    );


    const getClientWorks = (clientId: string) =>
        works.filter((w) => w.clientId === clientId);

    return {
        works,
        loading,
        addWork,
        updateWork,
        deleteWork,
        getWork,
        getClientWorks,
        getWorkById
    };
};
