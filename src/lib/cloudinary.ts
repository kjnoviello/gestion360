export type UploadedFile = {
    url: string;
    name: string;
    type: "image" | "pdf";
};

export async function uploadToCloudinary(
    file: File
): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("folder", "gestion360/works");

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/auto/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) {
        console.error("Error subiendo archivo:", await res.text());
        throw new Error("Error subiendo archivo");
    }

    const data = await res.json();

    return {
        url: data.secure_url,
        name: data.original_filename,
        type: data.resource_type === "image" ? "image" : "pdf",
    };
}