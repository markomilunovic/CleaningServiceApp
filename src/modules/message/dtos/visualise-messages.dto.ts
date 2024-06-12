import { IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class VisualiseMessagesDto {
    @IsInt()
    @IsNotEmpty({ message: 'receiverId is required'} )
    receiverId: number;

    @IsEnum(['user', 'worker'])
    @IsNotEmpty({ message: 'receiverType is required' })
    receiverType: 'user' | 'worker';
};