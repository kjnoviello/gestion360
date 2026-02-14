// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { v4 as uuid } from "uuid";
// import { storage } from "../lib/firebase";

// export async function uploadFile(
//     file: File,
//     folder: "pdf" | "photo"
// ) {
//     const ext = file.name.split(".").pop();
//     const fileName = `${folder}/${uuid()}.${ext}`;
//     const storageRef = ref(storage, fileName);

//     await uploadBytes(storageRef, file);
//     const url = await getDownloadURL(storageRef);

//     return {
//         url,
//         name: file.name,
//         path: fileName,
//     };
// }
