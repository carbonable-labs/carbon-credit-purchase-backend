import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStockDto } from './create-stock.dto';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStockDto extends PartialType(CreateStockDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isRetired: boolean;
}
