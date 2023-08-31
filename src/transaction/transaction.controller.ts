import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  ITransactionService,
  TRANSACTION_SERVICE,
} from './transaction.interface';
import { Transaction } from './entities/transaction.entity';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly _transactionService: ITransactionService,
  ) {}

  @ApiOperation({ summary: 'Create a new transaction for an order' })
  @ApiCreatedResponse({
    type: Transaction,
    description: 'The transaction has been created added.',
  })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @UsePipes(new ValidationPipe())
  @Post(':orderId/:userId')
  create(
    @Param('orderId') orderId: string,
    @Param('userId') userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this._transactionService.create(
      orderId,
      userId,
      createTransactionDto,
    );
  }

  @ApiOperation({ summary: 'Get all transactions' })
  @ApiOkResponse({
    description: 'Return all transactions',
  })
  @Get()
  findAll() {
    return this._transactionService.findAll();
  }

  @ApiOperation({ summary: 'Get a transactionwith its id' })
  @ApiOkResponse({
    description: 'Return a transaction based on its id',
    type: Transaction,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._transactionService.findOne(id);
  }
}
