import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Inject,
} from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Stock } from './entities/stock.entity';
import { IStockService, STOCK_SERVICE } from './stock.interface';
import { AvailableStockDto } from './dto/available-stock.dto';

@ApiTags('stock')
@Controller('stock')
export class StockController {
  constructor(
    @Inject(STOCK_SERVICE)
    private readonly _stockService: IStockService,
  ) {}

  @ApiOperation({ summary: 'Get available carbon credit stock' })
  @ApiOkResponse({
    description: 'Return available carbon credit stock',
  })
  @Get('available')
  getAvailable(): Promise<AvailableStockDto> {
    const availableStock = this._stockService.availableStock();
    return availableStock;
  }

  @ApiOperation({ summary: 'Create a new carbon credit stock for a project' })
  @ApiCreatedResponse({
    type: Stock,
    description: 'The stock has been successfully added.',
  })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @UsePipes(new ValidationPipe())
  @Post(':projectId')
  create(
    @Param('projectId') projectId: string,
    @Body() createStockDto: CreateStockDto,
  ): Promise<Stock> {
    return this._stockService.create(projectId, createStockDto);
  }

  @ApiOperation({ summary: 'Get all carbon credit stock' })
  @ApiOkResponse({
    description: 'Return all carbon credit stock available or not.',
  })
  @Get()
  findAll(): Promise<Stock[]> {
    return this._stockService.findAll();
  }

  @ApiOperation({ summary: 'Get a carbon credit stock with its id' })
  @ApiOkResponse({
    description: 'Return a specific carbon credit stock based on its id',
    type: Stock,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Stock not found' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Stock> {
    const stock = await this._stockService.findOne(id);
    console.log(stock);
    return stock;
  }

  @ApiOperation({ summary: 'Update a carbon credit stock' })
  @ApiOkResponse({ description: 'The stock was updated successfully' })
  @ApiNotFoundResponse({ description: 'Stock not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<Stock> {
    return this._stockService.update(id, updateStockDto);
  }

  @ApiOperation({ summary: 'Delete a carbon credit stock' })
  @ApiOkResponse({ description: 'The stock was deleted successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<string> {
    return this._stockService.remove(id);
  }
}
