import { IsInt, IsNotEmpty } from 'class-validator';

export class JobApplicationDTO {
  @IsInt()
  @IsNotEmpty()
  workerId: number;
}
