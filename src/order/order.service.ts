import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'nestjs-prisma';
import { Order } from './entities/order.entity';
import { IOrderService } from './order.interface';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService implements IOrderService {
  constructor(private prisma: PrismaService) {}
  create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    return this.prisma.order.create({
      data: {
        ...createOrderDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findAll(): Promise<Order[]> {
    return this.prisma.order.findMany();
  }

  findOne(id: string): Promise<Order> {
    return this.prisma.order.findUniqueOrThrow({ where: { id } });
  }

  update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.prisma.order.update({ where: { id }, data: updateOrderDto });
  }

  async sumOngoingOrders(): Promise<number> {
    const result = await this.prisma.order.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        OR: [{ status: 'PENDING' }, { status: 'BOOKED' }],
      },
    });

    return result._sum.amount;
  }

  async findBookedOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: {
        status: 'BOOKED',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // Cancel pending orders created more than 5 minutes ago
  async cancelOrders(): Promise<number> {
    const result = await this.prisma.order.updateMany({
      data: {
        status: OrderStatus.CANCELLED,
      },
      where: {
        status: 'PENDING',
        createdAt: {
          lte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });

    return result.count;
  }
}
