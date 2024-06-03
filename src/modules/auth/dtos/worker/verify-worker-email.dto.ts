import { IsEmail, IsNotEmpty } from "class-validator";

export class VerifyWorkerEmailDto {
    @IsNotEmpty({ message: "Email is required" })
    @IsEmail()
    email: string
};