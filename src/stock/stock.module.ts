import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { STOCK_SERVICE } from './stock.interface';
import { OrderModule } from 'src/order/order.module';
import { PriceModule } from 'src/price/price.module';

@Module({
  controllers: [StockController],
  providers: [
    {
      provide: STOCK_SERVICE,
      useClass: StockService,
    },
  ],
  imports: [OrderModule, PriceModule],
  exports: [STOCK_SERVICE],
})
export class StockModule { }
