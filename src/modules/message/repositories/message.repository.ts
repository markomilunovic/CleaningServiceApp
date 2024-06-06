import { Injectable } from '@nestjs/common';
import { SendMessageType, VisualiseMessagesType } from '../utils/types';
import { Message } from '../models/message.model';

@Injectable()
export class MessageRepository {

    async sendMessage(sendMessageType: SendMessageType, senderId: number, senderType: 'user' | 'worker'): Promise<void> {

        const { receiverId, receiverType, jobId, content } = sendMessageType;

        await Message.create({ senderId: senderId, 
                               senderType: senderType, 
                               receiverId: receiverId, 
                               receiverType: receiverType, 
                               jobId: jobId,
                               content: content 
                            });
    };


    async findMessagesBetween(visualiseMessagesType: VisualiseMessagesType, senderId: number, senderType: 'user' | 'worker'): Promise<Message[]> {

        const { receiverId, receiverType } = visualiseMessagesType;

        return Message.findAll({
            where: {
                senderId,
                senderType,
                receiverId,
                receiverType
            }
        });
    };
};
