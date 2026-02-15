export interface Work {
    id: string;
    clientId: string;
    workDescription: string;
    date: string;
    createdAt: number;

    budget: {
        amount: number;
        // pdfUrl?: string;
        pdfName?: string;
        pdfPath?: string;
    };

    // imageUrl?: string;
    imageName?: string;
    imagePath?: string;
}