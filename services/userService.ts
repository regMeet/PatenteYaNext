import { db } from '@/firebase/firestore';
import { User } from '@/types';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'users';

export const createUser = async (id: string, data: User) => {
    const userRef = doc(db, COLLECTION_NAME, id);
    await setDoc(userRef, data);
};

export const updateUser = async (id: string, data: Partial<User>) => {
    const userRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(userRef, data);
};

export const getUser = async (id: string): Promise<User | null> => {
    const userRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
        return snapshot.data() as User;
    }
    return null;
};
