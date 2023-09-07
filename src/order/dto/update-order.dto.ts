import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  BOOKED = 'BOOKED',
  EXECUTED = 'EXECUTED',
}

export class UpdateOrderDto {
  @ApiProperty({ enum: OrderStatus })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
