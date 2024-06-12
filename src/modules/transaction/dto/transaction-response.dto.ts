import { Transaction } from '../transaction.model';

export class TransactionResponseDto {
  id: number;
  jobId: number;
  userId: number;
  workerId: number;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(transaction: Transaction) {
    this.id = transaction.id;
    this.jobId = transaction.jobId;
    this.userId = transaction.userId;
    this.workerId = transaction.workerId;
    this.amount = transaction.amount;
    this.status = transaction.status;
    this.createdAt = transaction.createdAt;
    this.updatedAt = transaction.updatedAt;
  }
}
