import { Body, Controller, Get, InternalServerErrorException, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { SendMessageDto } from '../dtos/send-message.dto';
import { ResponseDto } from 'common/dto/response.dto';
import { JwtCombinedGuard } from 'common/guards/jwt-combined.guard';

@Controller('message')
export class MessageController {

    constructor(
        private readonly messageService: MessageService) {}

    @UseGuards(JwtCombinedGuard)
    @Post('send')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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
};
