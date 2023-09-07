import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPriceService, PRICE_SERVICE } from './price.interface';

@ApiTags('price')
@Controller('price')
export class PriceController {
  constructor(
    @Inject(PRICE_SERVICE)
    private readonly _priceService: IPriceService,
  ) {}

  @ApiOperation({ summary: 'Get current purchase price' })
  @ApiOkResponse({ description: 'Return the current purchase price' })
  @Get('current')
  current(): number {
    return this._priceService.getCurrentPrice();
  }
}
