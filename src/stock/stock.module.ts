import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { STOCK_SERVICE } from './stock.interface';

@Module({
  controllers: [StockController],
  providers: [
    {
      provide: STOCK_SERVICE,
      useClass: StockService,
    },
  ],
})
export class StockModule {}
