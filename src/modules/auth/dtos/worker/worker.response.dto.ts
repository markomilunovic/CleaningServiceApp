import { WorkerNoPasswordType } from "modules/auth/utils/worker-types";

export class WorkerResponseDto {
    id: number
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

    constructor(worker: WorkerNoPasswordType) {
        this. id = worker.id;
        this.firstName = worker.firstName;
        this.lastName = worker.lastName;
        this.email = worker.email;
        this.idCardPhotoFrontUrl = worker.idCardPhotoFrontUrl;
        this.idCardPhotoBackUrl = worker.idCardPhotoBackUrl;
        this.hourlyRate = worker.hourlyRate;
        this.cities = worker.cities;
        this.municipalities = worker.municipalities;
        this.emailVerified = worker.emailVerified;
        this.termsAccepted = worker.termsAccepted;
        this.verifiedByAdmin = worker.verifiedByAdmin;
    };
};