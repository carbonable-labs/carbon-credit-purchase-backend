import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { IStockService } from './stock.interface';
import { Stock } from './entities/stock.entity';
import { PrismaService } from 'nestjs-prisma';
import { monotonicFactory } from 'ulid';
import { AvailableStockDto } from './dto/available-stock.dto';

@Injectable()
export class StockService implements IStockService {
  constructor(private prisma: PrismaService) {}

  create(projectId: string, createStockDto: CreateStockDto): Promise<Stock> {
    const ulid = monotonicFactory();
    return this.prisma.carbonCredit.create({
      data: {
        id: ulid().toString(),
        ...createStockDto,
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  }

  findAll(): Promise<Stock[]> {
    return this.prisma.carbonCredit.findMany();
  }

  findOne(id: string): Promise<Stock> {
    return this.prisma.carbonCredit.findUniqueOrThrow({ where: { id } });
  }

  update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
    return this.prisma.carbonCredit.update({
      where: { id },
      data: updateStockDto,
    });
  }

  async remove(id: string): Promise<string> {
    await this.prisma.carbonCredit.delete({ where: { id } });
    return id;
  }

  async availableStock(): Promise<AvailableStockDto> {
    // Get the total number of not retired carbon credits
    const notRetired = await this.prisma.carbonCredit.count({
      where: {
        isRetired: false,
      },
    });

    // Get the total number of booked carbon credits
    const booked = await this.prisma.order.groupBy({
      by: ['status'],
      where: {
        NOT: {
          status: 'CANCELLED',
        },
      },
      _sum: {
        amount: true,
      },
    });

    const notCancelledOrders = booked[0]?._sum?.amount || 0;
    const available = notRetired - notCancelledOrders;

    return { available };
  }

  getExPostStock(): Promise<Stock[]> {
    const currentYear = new Date().getFullYear();
    return this.prisma.carbonCredit.findMany({
      where: {
        isRetired: false,
        vintage: {
          lte: currentYear.toString(),
        },
        auditStatus: 'AUDITED',
      },
    });
  }

  getExAnteStock(): Promise<Stock[]> {
    const currentYear = new Date().getFullYear();
    return this.prisma.carbonCredit.findMany({
      where: {
        isRetired: false,
        vintage: {
          gt: currentYear.toString(),
        },
        NOT: {
          auditStatus: 'AUDITED',
        },
      },
    });
  }

  getExPostStockCount(): Promise<number> {
    const currentYear = new Date().getFullYear();
    return this.prisma.carbonCredit.count({
      where: {
        isRetired: false,
        vintage: {
          lte: currentYear.toString(),
        },
        auditStatus: 'AUDITED',
      },
    });
  }

  getExAnteStockCount(): Promise<number> {
    const currentYear = new Date().getFullYear();
    return this.prisma.carbonCredit.count({
      where: {
        isRetired: false,
        vintage: {
          gte: currentYear.toString(),
        },
        NOT: {
          auditStatus: 'AUDITED',
        },
      },
    });
  }
}
