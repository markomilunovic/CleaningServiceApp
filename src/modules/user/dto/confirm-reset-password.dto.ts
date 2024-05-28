import { IsNotEmpty, IsString, Length } from "class-validator";

export class ConfirmResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @Length(8, 128)
    readonly newPassword: string;
}
