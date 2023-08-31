import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'nestjs-prisma';
import { Transaction } from './entities/transaction.entity';
import { ITransactionService } from './transaction.interface';

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(private prisma: PrismaService) {}
  create(
    orderId: string,
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        order: {
          connect: {
            id: orderId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }

  findOne(id: string): Promise<Transaction> {
    return this.prisma.transaction.findUniqueOrThrow({
      where: { id },
    });
  }
}
