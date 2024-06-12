import { Message } from "../models/message.model";

export class messagesResponseDto {
    senderId: number;
    senderType: 'user' | 'worker';
    receiverId: number;
    receiverType: 'user' | 'worker';
    jobId: number;
    content: string;

    constructor(message: Message) {
        this.senderId = message.senderId;
        this.senderType = message.senderType;
        this.receiverId = message.receiverId;
        this.receiverType = message.receiverType;
        this.jobId = message.jobId;
        this.content = message.content;
    };
};