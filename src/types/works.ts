export interface Work {
    id: string;
    clientId: string;
    workDescription: string;
    date: string;
    createdAt: number;

    budget: {
        amount: number;
        pdfUrl?: string;
        pdfName?: string;
    };

    imageUrl?: string;
    imageName?: string;
    photoName?: string;
}