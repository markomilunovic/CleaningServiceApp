import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './transaction.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(Transaction) private transactionModel: typeof Transaction,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionModel.create(createTransactionDto);
  }

  async findTransactionById(transactionId: number): Promise<Transaction> {
    const transaction = await this.transactionModel.findByPk(transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async updateStatus(transaction: Transaction, status: string): Promise<Transaction> {
    transaction.status = status;
    return transaction.save();
  }
}
