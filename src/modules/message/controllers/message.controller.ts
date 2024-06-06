import { Body, Controller, InternalServerErrorException, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { SendMessageDto } from '../dtos/send-message.dto';
import { ResponseDto } from 'common/dto/response.dto';
import { JwtCombinedGuard } from 'common/guards/jwt-combined.guard';
import { VisualiseMessagesDto } from '../dtos/visualise-messages.dto';
import { messagesResponseDto } from '../dtos/messages-response.dto';

@Controller('message')
export class MessageController {

    constructor(
        private readonly messageService: MessageService) {}

    @UseGuards(JwtCombinedGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    @Post('send')
    async sendMessage(@Req() req, @Body() sendMessageDto: SendMessageDto): Promise<ResponseDto<null>> {

        try {

            const sender = req.user;
            const senderId = sender.id;
            const senderType = sender.userType;

            await this.messageService.sendMessage(sendMessageDto, senderId, senderType);
            
            return new ResponseDto(null, 'Message sent successfully');

        } catch (error) {
            throw new InternalServerErrorException('Error sending message');
        };
    };

    @UseGuards(JwtCombinedGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    @Post('visualise')
    async visualiseMessages(@Req() req, @Body() visualiseMessagesDto: VisualiseMessagesDto) {

        try {

            const sender = req.user;
            const senderId = sender.id;
            const senderType = sender.userType;

            const messages = await this.messageService.visualiseMessages(visualiseMessagesDto, senderId, senderType);
            const messagesResponseDtos = messages.map(message => new messagesResponseDto(message));
            const messageText = messages.length > 0 ? "Messages retrieved successfully" : "No messages found with the specified person";

            return new ResponseDto(messagesResponseDtos, messageText);

        } catch (error) {
            throw new InternalServerErrorException('Error retrieving messages')
        };
    };
};
