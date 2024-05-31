import { IsString, IsEmail, IsNotEmpty, IsInt, Min, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 128)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsInt()
  @Min(1)
  readonly buildingNumber: number;

  @IsInt()
  @Min(0)
  readonly floor: number;

  @IsString()
  @IsNotEmpty()
  readonly apartmentNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 15)
  readonly contactPhone: string;
}
