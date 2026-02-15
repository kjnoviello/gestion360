import { supabase } from "./supabase";

export type UploadedFile = {
    name: string;
    path: string;
};

export async function uploadFile(
    file: File,
    bucket: "work-images" | "work-pdfs"
): Promise<UploadedFile> {

    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file);

    if (error) throw error;

    // 🔒 No generamos signed URL aquí
    // Solo devolvemos metadata persistente

    return {
        name: file.name,
        path,
    };
}

export async function getSignedUrl(
    path: string,
    bucket: "work-images" | "work-pdfs",
    expiresIn: number = 60 * 60
): Promise<string> {

    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

    if (error) throw error;

    return data.signedUrl;
}

export async function deleteFile(
    bucket: "work-images" | "work-pdfs",
    path?: string
) {
    if (!path) return;

    const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) throw error;
}
