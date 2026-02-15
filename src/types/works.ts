export interface Work {
    id: string;
    clientId: string;
    workDescription: string;
    date: string;
    createdAt: number;

    budget: {
        amount: number;
        pdfName?: string;
        pdfPath?: string;
    };

    imageName?: string;
    imagePath?: string;
}