export type RegisterWorkerType = {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    hourlyRate: number;
    cities: object;
    municipalities: object;
};

export type registeredWorkerType = {
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