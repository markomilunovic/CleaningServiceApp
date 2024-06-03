import { Worker } from 'modules/worker/models/worker.model';
import { WorkerNoPasswordType } from './worker-types';

export function workerPasswordFilter(worker: Worker): WorkerNoPasswordType {
    return {
        id: worker.id,
        firstName: worker.firstName,
        lastName: worker.lastName,
        email: worker.email,
        cities: worker.cities,
        municipalities: worker.municipalities,
        hourlyRate: worker.hourlyRate,
        idCardPhotoFrontUrl: worker.idCardPhotoFrontUrl,
        idCardPhotoBackUrl: worker.idCardPhotoBackUrl,
        emailVerified: worker.emailVerified,
        verifiedByAdmin: worker.verifiedByAdmin,
        termsAccepted: worker.termsAccepted
    };
};
