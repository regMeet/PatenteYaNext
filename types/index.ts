export interface User {
    id: string;
    email: string;
    displayName?: string;
    phone?: string;
    photoURL?: string;
    createdAt: number;
    firstLoginAt?: number;
    lastLoginAt?: number;
    reportsCount?: number;
}

export interface Plate {
    id: string;
    normalized: string;    // ABC123
    raw: string;           // A B C 1 2 3
    city?: string;
    province?: string;
    country?: string;
    createdAt: number;
    updatedAt?: number;
}

export interface Report {
    id: string;
    userId: string;
    plateId: string;
    status: "lost" | "found" | "resolved";
    geohash?: string;
    lat?: number;
    lng?: number;
    imageUrl?: string;
    notes?: string;
    createdAt: number;
}
