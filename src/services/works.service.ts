import { supabase } from "../lib/supabase";
import { deleteFile } from "../lib/storage";
import { Work } from "../types/works";

const TABLE = "works";

const mapFromDB = (row: any): Work => ({
    id: row.id,
    clientId: row.client_id,
    workDescription: row.work_description,
    date: row.date,
    createdAt: row.created_at,

    budget: {
        amount: Number(row.budget_amount),
        pdfName: row.pdf_name ?? undefined,
        pdfPath: row.pdf_path ?? undefined,
    },

    imageName: row.image_name ?? undefined,
    imagePath: row.image_path ?? undefined,
});

export const getWorks = async (): Promise<Work[]> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map(mapFromDB);
};

export const createWork = async (
    data: Omit<Work, "id" | "createdAt">
): Promise<string> => {
    const { data: inserted, error } = await supabase
        .from(TABLE)
        .insert({
            client_id: data.clientId,
            work_description: data.workDescription,
            date: data.date,
            created_at: Date.now(),

            budget_amount: data.budget.amount,

            image_name: data.imageName ?? null,
            image_path: data.imagePath ?? null,

            pdf_name: data.budget.pdfName ?? null,
            pdf_path: data.budget.pdfPath ?? null,
        })
        .select()
        .single();

    if (error) throw error;

    return inserted.id;
};


export const updateWorkById = async (
    id: string,
    data: Partial<Omit<Work, "id" | "createdAt">>
): Promise<void> => {
    const { data: existing, error: fetchError } = await supabase
        .from(TABLE)
        .select("image_path, pdf_path, image_name, pdf_name")
        .eq("id", id)
        .single();

    if (fetchError) throw fetchError;

    // 🔹 SOLO borrar si el path cambió
    if (
        data.imagePath &&
        existing?.image_path &&
        data.imagePath !== existing.image_path
    ) {
        await deleteFile("work-images", existing.image_path);
    }

    if (
        data.budget.pdfPath &&
        existing?.pdf_path &&
        data.budget.pdfPath !== existing.pdf_path
    ) {
        await deleteFile("work-pdfs", existing.pdf_path);
    }

    const { error } = await supabase
        .from(TABLE)
        .update({
            client_id: data.clientId,
            work_description: data.workDescription,
            date: data.date,
            budget_amount: data.budget.amount,

            image_name: data.imageName ?? existing?.image_name ?? null,
            image_path: data.imagePath ?? existing?.image_path ?? null,

            pdf_name: data.budget.pdfName ?? existing?.pdf_name ?? null,
            pdf_path: data.budget.pdfPath ?? existing?.pdf_path ?? null,
        })
        .eq("id", id);

    if (error) throw error;
};

export const deleteWorkById = async (id: string): Promise<void> => {
    const { data: existing } = await supabase
        .from(TABLE)
        .select("image_path, pdf_path")
        .eq("id", id)
        .single();

    if (existing?.image_path) {
        await deleteFile("work-images", existing.image_path);
    }

    if (existing?.pdf_path) {
        await deleteFile("work-pdfs", existing.pdf_path);
    }

    const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq("id", id);

    if (error) throw error;
};
