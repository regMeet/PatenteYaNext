"use client";

import { auth, googleProvider } from '@/firebase/auth';
import { createUser, getUser } from '@/services/userService';
import { User as DomainUser } from '@/types';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: DomainUser | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    loginWithGoogle: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<DomainUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Sync with Firestore
                const existingUser = await getUser(firebaseUser.uid);
                const now = Date.now();

                let userData: DomainUser;

                if (existingUser) {
                    userData = {
                        ...existingUser,
                        lastLoginAt: now,
                    };
                    // Update last login
                    // We can do this asynchronously without waiting
                    // updateUser(firebaseUser.uid, { lastLoginAt: now });
                } else {
                    userData = {
                        id: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        displayName: firebaseUser.displayName || '',
                        photoURL: firebaseUser.photoURL || '',
                        createdAt: now,
                        firstLoginAt: now,
                        lastLoginAt: now,
                        reportsCount: 0,
                    };
                    await createUser(firebaseUser.uid, userData);
                }
                setUser(userData);
                document.cookie = "auth=true; path=/";
            } else {
                setUser(null);
                document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push('/dashboard');
        } catch (error) {
            console.error("Error logging in with Google", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
            router.push('/');
        } catch (error) {
            console.error("Error logging out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
