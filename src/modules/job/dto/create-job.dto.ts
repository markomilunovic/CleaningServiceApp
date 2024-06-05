import { IsString, IsInt, IsNotEmpty, IsOptional, IsEnum, IsObject } from 'class-validator';

export class CreateJobDTO {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  workerId?: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  squareMeters: number;

  @IsObject()
  @IsNotEmpty()
  rooms: object;

  @IsObject()
  @IsNotEmpty()
  tasks: object;

  @IsOptional()
  @IsInt()
  hourlyRate?: number;

  @IsOptional()
  @IsInt()
  totalValue?: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  municipality: string;

  @IsEnum(['pending', 'accepted', 'completed'])
  @IsNotEmpty()
  status: string;
}
