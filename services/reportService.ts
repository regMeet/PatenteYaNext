import { db } from '@/firebase/firestore';
import { Report } from '@/types';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import geohash from 'ngeohash';

const COLLECTION_NAME = 'reports';

export const createReport = async (report: Omit<Report, 'id'>) => {
    const reportData = { ...report };

    if (reportData.lat && reportData.lng) {
        reportData.geohash = geohash.encode(reportData.lat, reportData.lng);
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), reportData);
    // Update the doc with its own ID if needed, or just rely on Firestore ID.
    // The interface has 'id', so we might want to store it or return it.
    // Let's return the ID.
    return docRef.id;
};

export const updateReport = async (id: string, data: Partial<Report>) => {
    const reportRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(reportRef, data);
};

export const getReportsByUser = async (userId: string): Promise<Report[]> => {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
};

export const getReport = async (id: string): Promise<Report | null> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Report;
    }
    return null;
};
