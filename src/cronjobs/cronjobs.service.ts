import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderStatus } from 'src/order/dto/update-order.dto';
import { IOrderService, ORDER_SERVICE } from 'src/order/order.interface';
import { IStockService, STOCK_SERVICE } from 'src/stock/stock.interface';

@Injectable()
export class CronjobsService {
  constructor(
    @Inject(ORDER_SERVICE)
    private readonly _orderService: IOrderService,
    @Inject(STOCK_SERVICE)
    private readonly _stockService: IStockService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async executeBookedOrders() {
    console.log('Execute booked orders');

    // Retrieve booked orders
    const orders = await this._orderService.findBookedOrders();

    console.log(`Found ${orders.length} booked orders`);

    // For each order, check if there is enough stock to retire and execute it
    for (const order of orders) {
      // Get the stock that can be retired
      const stocks = await this._stockService.findStockToRetire(order.amount);

      if (stocks.length !== order.amount) {
        console.log(
          `Not enough ex-post stock to execute order ${order.id} (available: ${stocks.length}, order: ${order.amount})`,
        );
        return;
      }

      // Bulk update stock status
      await this._stockService.retire(stocks);

      // Update order status
      await this._orderService.update(order.id, {
        status: OrderStatus.EXECUTED,
      });

      // TODO: Generate certificate
    }
  }

  // TODO: Add cronjob to canceled unpaid orders
  @Cron(CronExpression.EVERY_5_SECONDS)
  async executeCanceledOrders() {
    console.log('Execute canceled orders');

    // Retrieve canceled orders
    const orders = await this._orderService.cancelOrders();

    console.log(`Found ${orders} orders to cancel`);
  }
}
