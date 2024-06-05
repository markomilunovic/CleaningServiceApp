import { IsInt, IsNotEmpty } from 'class-validator';

export class JobApplicationDTO {
  @IsInt()
  @IsNotEmpty()
  jobId: number;

  @IsInt()
  @IsNotEmpty()
  workerId: number;
}
