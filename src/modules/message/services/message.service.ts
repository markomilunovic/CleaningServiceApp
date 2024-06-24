import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';
import { SendMessageType, VisualiseMessagesType } from '../utils/types';
import { JobRepository } from 'modules/job/job.repository';
import { Message } from '../models/message.model';

@Injectable()
export class MessageService {

    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly jobRepository: JobRepository
    ) {}

    async sendMessage(sendMessageType: SendMessageType, senderId: number, senderType: 'user' | 'worker'): Promise<void> {

        const { jobId } = sendMessageType;

        if (jobId !== undefined) { 
            const job = await this.jobRepository.findJobById(jobId);

            if (!job) {
                throw new NotFoundException('Job does not exist');
            };
        };

        await this.messageRepository.sendMessage(sendMessageType, senderId, senderType);

    };

    async visualiseMessages(visualiseMessagesType: VisualiseMessagesType, senderId: number, senderType: 'user' | 'worker'): Promise<Message[]> {

        const messages = await this.messageRepository.findMessagesBetween(visualiseMessagesType, senderId, senderType);

        return messages;

    };
};
