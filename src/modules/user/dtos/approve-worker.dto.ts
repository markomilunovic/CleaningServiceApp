import { IsNotEmpty, IsNumber } from "class-validator";

export class ApproveWorkerDto {
    @IsNumber()
    @IsNotEmpty({ message: 'id is required' })
    id: number;
};