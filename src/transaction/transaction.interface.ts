import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

export const TRANSACTION_SERVICE = 'TRANSACTION SERVICE';

export interface ITransactionService {
  findAll(): Promise<Transaction[]>;
  findOne(id: string): Promise<Transaction>;
  create(
    orderId: string,
    userId: string,
    stock: CreateTransactionDto,
  ): Promise<Transaction>;
}
