import { IsString, IsEmail, IsOptional, IsInt, Min, Length } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  @Length(2, 30)
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  @Length(2, 30)
  readonly lastName?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly address?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  readonly buildingNumber?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  readonly floor?: number;

  @IsString()
  @IsOptional()
  readonly apartmentNumber?: string;

  @IsString()
  @IsOptional()
  readonly city?: string;

  @IsString()
  @IsOptional()
  @Length(10, 15)
  readonly contactPhone?: string;
}