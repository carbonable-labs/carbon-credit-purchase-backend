import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

enum PaymentProvider {
  STRIPE = 'STRIPE',
  CRYPTO = 'CRYPTO',
}

export class CreateTransactionDto {
  @ApiProperty({ enum: PaymentProvider })
  @IsNotEmpty()
  @IsEnum(PaymentProvider)
  paymentProvider: PaymentProvider;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  externalId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currency: string;
}
