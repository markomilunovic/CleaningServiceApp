import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterWorkerDto {
    @IsNotEmpty({ message: 'First name is required' })
    firstName: string;

    @IsNotEmpty({ message: 'Last name is required' })
    lastName: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: 'Hourly rate is required'})
    hourlyRate: number;

    @IsNotEmpty({ message: 'Cities are required' })
    cities: object;

    @IsNotEmpty({ message: 'Municipalities are required' })
    municipalities: object;
};