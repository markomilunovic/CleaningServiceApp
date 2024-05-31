import { IsEmail, IsOptional } from "class-validator";

export class EditWorkerDto {
    @IsOptional()
    firstName: string;

    @IsOptional()
    lastName: string;

    @IsOptional()
    password: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    hourlyRate: number;

    @IsOptional()
    cities: object;

    @IsOptional()
    municipalities: object;
};