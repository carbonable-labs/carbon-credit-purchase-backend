import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ORDER_SERVICE } from './order.interface';

@Module({
  controllers: [OrderController],
  providers: [
    {
      provide: ORDER_SERVICE,
      useClass: OrderService,
    },
  ],
  exports: [ORDER_SERVICE],
})
export class OrderModule {}
