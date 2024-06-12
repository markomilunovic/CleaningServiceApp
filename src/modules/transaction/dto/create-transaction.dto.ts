import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  @IsNotEmpty()
  jobId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  workerId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  amount: number;
}
