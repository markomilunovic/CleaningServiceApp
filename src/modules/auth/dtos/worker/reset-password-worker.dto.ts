import { IsNotEmpty } from "class-validator";

export class ResetPasswordWorkerDto {
    @IsNotEmpty({ message: 'New password is required' })
    newPassword: string;

    @IsNotEmpty({ message: 'Token is required' })
    token: string;
};