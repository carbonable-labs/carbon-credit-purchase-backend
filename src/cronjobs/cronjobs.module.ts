import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { StockModule } from 'src/stock/stock.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  providers: [CronjobsService],
  imports: [StockModule, OrderModule],
})
export class CronjobsModule {}
