import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { PRICE_SERVICE } from './price.interface';

@Module({
  controllers: [PriceController],
  providers: [
    {
      provide: PRICE_SERVICE,
      useClass: PriceService,
    },
  ],
  exports: [PRICE_SERVICE],
})
export class PriceModule { }
