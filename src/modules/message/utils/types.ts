export type SendMessageType = {
    receiverId: number;
    receiverType: 'user' | 'worker';
    jobId?: number;
    content: string;
};

export type VisualiseMessagesType = {
    receiverId: number;
    receiverType: 'user' | 'worker';
};