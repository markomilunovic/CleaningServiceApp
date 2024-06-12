import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JobRepository } from 'modules/job/job.repository';
import { UserRepository } from 'modules/user/repositories/user.repository';
import { WorkerRepository } from 'modules/worker/repositories/worker.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly jobRepository: JobRepository,
    private readonly userRepository: UserRepository,
    private readonly workerRepository: WorkerRepository,
  ) {}

  async initiateTransaction(createTransactionDto: CreateTransactionDto) {
    try {
      const { jobId, userId, workerId, amount } = createTransactionDto;

      const job = await this.jobRepository.findJobById(jobId);
      const user = await this.userRepository.findUserById(userId);
      const worker = await this.workerRepository.findWorkerById(workerId);

      if (!job) {
        throw new BadRequestException('Invalid job ID');
      }
      if (!user) {
        throw new BadRequestException('Invalid user ID');
      }
      if (!worker) {
        throw new BadRequestException('Invalid worker ID');
      }

      return this.transactionRepository.create({
        jobId,
        userId,
        workerId,
        amount
      });
    } catch (error) {
      console.error('Error initiating transaction:', error);
      throw new BadRequestException('An error occurred while initiating the transaction');
    }
  }

  async confirmTransaction(transactionId: number) {
    try {
      const transaction = await this.transactionRepository.findTransactionById(transactionId);
      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }
      return this.transactionRepository.updateStatus(transaction, 'completed');
    } catch (error) {
      console.error('Error confirming transaction:', error);
      throw new BadRequestException('An error occurred while confirming the transaction');
    }
  }
}