import { storage } from '@/firebase/storage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const uploadReportImage = async (reportId: string, file: File): Promise<string> => {
    const storageRef = ref(storage, `reports/${reportId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

export const getFileUrl = async (path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
};
