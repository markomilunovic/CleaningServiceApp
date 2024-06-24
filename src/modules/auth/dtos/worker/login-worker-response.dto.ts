import { WorkerNoPasswordType } from "modules/auth/utils/worker-types";

export class LoginWorkerResponseDto {
    accessToken: string;
    refreshToken: string;
    worker: WorkerNoPasswordType;

    constructor(accessToken: string, refreshToken: string, worker: WorkerNoPasswordType){
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.worker = worker;
    };
};
