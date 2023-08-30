import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum CarbonCreditType {
  RESTORATION = 'RESTORATION',
  CONCERVATION = 'CONCERVATION',
}

export enum CarbonCreditOrigin {
  FORWARD_FINANCE = 'FORWARD_FINANCE',
  DIRECT_PURCHASE = 'DIRECT_PURCHASE',
}

export class CreateStockDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vintage: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: CarbonCreditType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  origin: CarbonCreditOrigin;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  purchasePrice?: bigint;
}
