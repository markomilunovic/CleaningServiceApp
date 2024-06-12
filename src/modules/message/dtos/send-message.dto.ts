import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendMessageDto {
    @IsInt()
    @IsNotEmpty({ message: 'receiverId is required' })
    receiverId: number;

    @IsEnum(['user', 'worker'])
    @IsNotEmpty({ message: 'receiverType is required' })
    receiverType: 'user' | 'worker';

    @IsInt()
    @IsOptional()
    jobId: number;

    @IsString()
    @IsNotEmpty({ message: 'content is required' })
    content: string;
};