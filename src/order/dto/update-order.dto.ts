import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from './create-order.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({ enum: OrderStatus })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
