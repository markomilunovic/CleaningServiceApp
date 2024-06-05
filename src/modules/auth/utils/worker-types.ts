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

export type AccessTokneEncodeType = {
    jti: string;
    sub: number;
};

export type RefreshTokneEncodeType = {
    jti: string;
    sub: string;
};

export type ResetTokneEncodeType = {
    jti: string;
    sub: string;
};

export type ForgotPasswordWorkerType = {
    email: string;
};

export type ResetPasswordWorkerType = {
    newPassword: string;
    token: string;
};

export type VerifyWorkerEmailType = {
    email: string;
};

export type VerificationTokneEncodeType = {
    jti: string;
    sub: string;
};

export type ConfirmWorkerEmailType = {
    token: string;
};


