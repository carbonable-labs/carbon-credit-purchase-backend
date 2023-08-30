import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IOrderService, ORDER_SERVICE } from './order.interface';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Order } from './entities/order.entity';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(
    @Inject(ORDER_SERVICE)
    private readonly _orderService: IOrderService,
  ) {}

  @ApiOperation({ summary: 'Create a new buying order' })
  @ApiCreatedResponse({
    type: Order,
    description: 'The order has been successfully created.',
  })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @UsePipes(new ValidationPipe())
  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this._orderService.create(userId, createOrderDto);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiOkResponse({
    description: 'Return all orders',
  })
  @Get()
  findAll() {
    return this._orderService.findAll();
  }

  @ApiOperation({ summary: 'Get an order with its id' })
  @ApiOkResponse({
    description: 'Return a specific order based on its id',
    type: Order,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._orderService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an order' })
  @ApiOkResponse({ description: 'The order was updated successfully' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this._orderService.update(id, updateOrderDto);
  }
}
