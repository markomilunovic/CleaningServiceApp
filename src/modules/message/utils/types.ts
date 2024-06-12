export type SendMessageType = {
    receiverId: number;
    receiverType: 'user' | 'worker';
    jobId?: number;
    content: string;
};