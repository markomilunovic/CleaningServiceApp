import { IsNotEmpty, IsNumber } from "class-validator";

export class ApproveJobDto {
    @IsNumber()
    @IsNotEmpty({ message: 'id is required' })
    id: number;
};