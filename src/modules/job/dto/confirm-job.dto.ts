import { IsInt, IsNotEmpty } from 'class-validator';

export class ConfirmJobDTO {
  @IsInt()
  @IsNotEmpty()
  jobId: number;
}
