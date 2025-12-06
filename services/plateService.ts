import { db } from '@/firebase/firestore';
import { Plate } from '@/types';
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';

const COLLECTION_NAME = 'plates';

export const normalizePlate = (raw: string): string => {
    return raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
};

export const createPlate = async (plate: Plate) => {
    const plateRef = doc(db, COLLECTION_NAME, plate.id);
    await setDoc(plateRef, plate);
};

export const updatePlate = async (id: string, data: Partial<Plate>) => {
    const plateRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(plateRef, data);
};

export const getPlateByNormalized = async (normalized: string): Promise<Plate | null> => {
    const q = query(collection(db, COLLECTION_NAME), where('normalized', '==', normalized));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        return snapshot.docs[0].data() as Plate;
    }
    return null;
};
