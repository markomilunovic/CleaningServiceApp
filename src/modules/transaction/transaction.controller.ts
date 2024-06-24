import { Controller, Post, Patch, Body, Param, HttpException, HttpStatus, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { ResponseDto } from 'common/dto/response.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('initiate')
  @UsePipes(new ValidationPipe({ transform: true }))
  async initiateTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<ResponseDto<TransactionResponseDto>> {
    try {
      const transaction = await this.transactionService.initiateTransaction(createTransactionDto);
      return new ResponseDto(new TransactionResponseDto(transaction), 'Transaction initiated successfully');
    } catch (error) {
      console.error('Error initiating transaction:', error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'An error occurred while initiating the transaction',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id/confirm')
  async confirmTransaction(@Param('id', ParseIntPipe) transactionId: number): Promise<ResponseDto<TransactionResponseDto>> {
    try {
      const transaction = await this.transactionService.confirmTransaction(transactionId);
      return new ResponseDto(new TransactionResponseDto(transaction), 'Transaction confirmed successfully');
    } catch (error) {
      console.error('Error confirming transaction:', error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'An error occurred while confirming the transaction',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
