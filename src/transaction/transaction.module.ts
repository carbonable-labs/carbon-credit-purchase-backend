import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TRANSACTION_SERVICE } from './transaction.interface';

@Module({
  controllers: [TransactionController],
  providers: [
    {
      provide: TRANSACTION_SERVICE,
      useClass: TransactionService,
    },
  ],
})
export class TransactionModule {}
