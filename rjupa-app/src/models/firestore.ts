export type UserDoc = {
    createdAt: unknown;
    credits: number;
    displayName?: string;
};

export type CartridgeDoc = {
    brand: string;
    material: string;
    loadGrams: number;
    norwegianNo: number;
    usNo: number;
    pelletDiameterMm: number;
    pelletCount: number;
};

export type TestDoc = {
    createdAt: unknown;
    analysisVersion: string;
    shotDistanceMeters: number;
    weapon: string;
    choke: string;

    cartridgeId?: string;
    cartridge: {
        pelletCount: number;
        isCustom: boolean;
        name?: string;
    };

    counts: {
        totalDetected: number;
        insideCircle: number;
        fieldCounts36: number[]; // must be length 36
    };

    metrics: {
        trangboring: number;
        kjerne: number;
        fordeling: number;
    };

    quality: {
        markersOk: boolean;
        referenceLineOk: boolean;
        sharpnessOk: boolean;
        coverageOk: boolean;
    };
};

export type PaymentDoc = {
    uid: string;
    provider: "vipps" | "test";
    providerRef: string;
    packSize: number;
    amount: number;
    currency: "NOK";
    status: "pending" | "verified" | "failed";
    createdAt: unknown;
    verifiedAt?: unknown;
};
