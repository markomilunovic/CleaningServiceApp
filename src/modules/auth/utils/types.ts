export type RegisterWorkerType = {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    hourlyRate: number;
    cities: object;
    municipalities: object;
};

export type WorkerNoPasswordType = {
    id?: number
    firstName: string;
    lastName: string;
    email: string;
    idCardPhotoFrontUrl: string;
    idCardPhotoBackUrl: string;
    hourlyRate: number;
    cities: object;
    municipalities: object;
    emailVerified: boolean;
    termsAccepted: boolean;
    verifiedByAdmin: boolean;
};

export type LoginWorkerType = {
    email: string;
    password: string;
};

export type RefreshTokneEncodeType = {
    jti: string;
    sub: string;
};

export type ResetTokneEncodeType = {
    jti: number;
    email: string;
};