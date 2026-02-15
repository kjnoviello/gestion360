// import { Client } from "./clients";
// import { Work } from "./works";

// export interface ClientContextType {
//     clients: Client[];
//     works: Work[];
//     isLoading: boolean;
//     addClient: (client: Omit<Client, "id" | "createdAt">) => Promise<string>;
//     updateClient: (id: string, client: Partial<Omit<Client, "id" | "createdAt">>) => Promise<void>;
//     deleteClient: (id: string) => Promise<void>;
//     getClient: (id: string) => Client | undefined;
//     addWork: (work: Omit<Work, "id" | "createdAt">) => Promise<string>;
//     updateWork: (id: string, work: Partial<Omit<Work, "id" | "createdAt">>) => Promise<void>;
//     deleteWork: (id: string) => Promise<void>;
//     getWork: (id: string) => Work | undefined;
//     getClientWorks: (clientId: string) => Work[];
//     uploadFile: (file: File, type: "pdf" | "photo") => Promise<{ url: string; name: string }>;
// }