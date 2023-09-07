import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

export const ORDER_SERVICE = 'ORDER SERVICE';

export interface IOrderService {
  findAll(): Promise<Order[]>;
  findOne(id: string): Promise<Order>;
  create(userId: string, order: CreateOrderDto): Promise<Order>;
  update(id: string, order: UpdateOrderDto): Promise<Order>;
  sumOngoingOrders(): Promise<number>;
  findBookedOrders(): Promise<Order[]>;
  cancelOrders(): Promise<number>;
}
