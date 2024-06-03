import { IsNotEmpty } from "class-validator";

export class ConfirmWorkerEmailDto {
    @IsNotEmpty({ message: 'Token is required' })
    token: string;
};