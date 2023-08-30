import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  BOOKED = 'BOOKED',
  EXECUTED = 'EXECUTED',
}

export class CreateOrderDto {
  @ApiProperty({ enum: OrderStatus })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
