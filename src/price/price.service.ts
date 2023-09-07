import { Injectable } from '@nestjs/common';
import { IPriceService } from './price.interface';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PriceService implements IPriceService {
  constructor(private prisma: PrismaService) {}
  getCurrentPrice(): number {
    return parseFloat(process.env.PURCHASE_PRICE);
  }
}
