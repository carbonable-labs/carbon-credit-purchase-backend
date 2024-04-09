import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { IStockService } from './stock.interface';
import { Stock } from './entities/stock.entity';
import { PrismaService } from 'nestjs-prisma';
import { monotonicFactory } from 'ulid';
import { AvailableStockDto } from './dto/available-stock.dto';
import { RetireStockDto } from './dto/retire-stock.dto';
import { IOrderService, ORDER_SERVICE } from 'src/order/order.interface';
import { Account, Contract, RpcProvider, num } from 'starknet';
import { IPriceService, PRICE_SERVICE } from 'src/price/price.interface';

@Injectable()
export class StockService implements IStockService {
  private ccContract: Contract;
  private account: Account;
  private provider: RpcProvider;
  private walletAddress: string;
  private carbonCreditAddress: string;

  constructor(
    private prisma: PrismaService,
    @Inject(ORDER_SERVICE)
    private readonly _orderService: IOrderService,
    @Inject(PRICE_SERVICE)
    private readonly _priceService: IPriceService,
  ) {
    this.setup();
  }
  async setup(): Promise<void> {
    const walletAddress = process.env.ARGENT_WALLET_ADDRESS;
    const carbonCreditAddress = process.env.CARBON_CREDIT_ADDRESS;

    const provider = new RpcProvider({
      nodeUrl: `${process.env.NODE_URL}?apikey=${process.env.RPC_API_KEY}`,
    });

    const account = new Account(
      provider,
      walletAddress,
      process.env.ARGENT_WALLET_PK,
    );

    const { abi: ccAbi } = await provider.getClassAt(carbonCreditAddress);

    if (ccAbi === undefined) {
      throw new Error('no abi.');
    }

    const ccContract = new Contract(ccAbi, carbonCreditAddress, provider);

    ccContract.connect(account);

    this.ccContract = ccContract;
    this.account = account;
    this.provider = provider;
    this.walletAddress = walletAddress;
    this.carbonCreditAddress = carbonCreditAddress;
  }

  create(projectId: string, createStockDto: CreateStockDto): Promise<Stock> {
    const ulid = monotonicFactory();
    return this.prisma.carbonCredit.create({
      data: {
        id: ulid().toString(),
        ...createStockDto,
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  }

  findAll(): Promise<Stock[]> {
    return this.prisma.carbonCredit.findMany();
  }

  async findAllWeb3(): Promise<Stock[]> {
    let stock: Stock[] = [];
    const tokenIds = [1, 2, 3];
    let balances = await this.ccContract.call('balance_of_batch', [[this.account.address, this.account.address, this.account.address], tokenIds]);
    let name = await this.ccContract.call('name', []);
    let start_time = await this.ccContract.call('get_start_time', []);
    let price = this._priceService.getCurrentPrice();
    let year = new Date(parseInt(start_time.toString()) * 1_000).getFullYear();
    console.log(year);
    console.log(start_time.toString());

    (balances as Array<BigInt>).forEach((balance, index) => {
      stock.push({
        id: tokenIds[index].toString(),
        number: balance.toString(),
        vintage: (year + index).toString(),
        type: 'blue',
        origin: name.toString(),
        purchasePrice: num.toBigInt(price * 1_000_000),
        isRetired: false,
        isLocked: false,
        isPurchased: false,
        auditStatus: 'projected',
        projectId: 'Manjarisoa',
      });
    });

    return stock
  }

  findOne(id: string): Promise<Stock> {
    return this.prisma.carbonCredit.findUniqueOrThrow({ where: { id } });
  }

  update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
    return this.prisma.carbonCredit.update({
      where: { id },
      data: updateStockDto,
    });
  }

  retire(stocks: RetireStockDto[]): Promise<any> {
    return this.prisma.carbonCredit.updateMany({
      data: {
        isRetired: true,
      },
      where: {
        id: {
          in: stocks.map((stock) => stock.id),
        },
      },
    });
  }

  async remove(id: string): Promise<string> {
    await this.prisma.carbonCredit.delete({ where: { id } });
    return id;
  }

  /**
   * @returns the number of available carbon credits
   */
  async availableStock(): Promise<AvailableStockDto> {
    // Get the total number of not retired carbon credits
    const notRetired = await this.prisma.carbonCredit.count({
      where: {
        isRetired: false,
      },
    });

    // Get the total number of booked carbon credits
    const booked = await this.prisma.order.groupBy({
      by: ['status'],
      where: {
        OR: [{ status: 'PENDING' }, { status: 'BOOKED' }],
      },
      _sum: {
        amount: true,
      },
    });

    const notCancelledOrders = booked[0]?._sum?.amount || 0;
    const available = notRetired - notCancelledOrders;

    return { available };
  }

  /**
   * @returns all ex-post carbon credits
   */
  getExPostStock(): Promise<Stock[]> {
    const currentYear = new Date().getFullYear();
    return this.prisma.carbonCredit.findMany({
      where: {
        isRetired: false,
        vintage: {
          lte: currentYear.toString(),
        },
        auditStatus: 'AUDITED',
      },
    });
  }

  /**
   * @returns all ex-ante carbon credits
   */
  getExAnteStock(): Promise<Stock[]> {
    const currentYear = new Date().getFullYear();
    return this.prisma.carbonCredit.findMany({
      where: {
        isRetired: false,
        vintage: {
          gt: currentYear.toString(),
        },
        NOT: {
          auditStatus: 'AUDITED',
        },
      },
    });
  }

  /**
   * @returns the number of ex-post carbon credits
   */
  getExPostStockCount(): Promise<number> {
    const currentYear = new Date().getFullYear();
    return this.prisma.carbonCredit.count({
      where: {
        isRetired: false,
        vintage: {
          lte: currentYear.toString(),
        },
        auditStatus: 'AUDITED',
      },
    });
  }

  /**
   * @returns the number of ex-ante carbon credits
   */
  getExAnteStockCount(): Promise<number> {
    const currentYear = new Date().getFullYear();
    return this.prisma.carbonCredit.count({
      where: {
        isRetired: false,
        vintage: {
          gte: currentYear.toString(),
        },
        NOT: {
          auditStatus: 'AUDITED',
        },
      },
    });
  }

  /**
   * @returns the year of the next available carbon credits
   * @param neededCC the number of carbon credits needed
   * @throws NotFoundException if there is not enough stock available
   */
  async getYearOfNextAvailableStock(neededCC: number): Promise<string> {
    const { available } = await this.availableStock();

    if (available < neededCC) {
      throw new NotFoundException('Not enough stock available');
    }

    const sumOngoingOrders = await this._orderService.sumOngoingOrders();

    const targetYear = await this.prisma.carbonCredit.findFirst({
      skip: sumOngoingOrders + neededCC - 1,
      where: {
        isRetired: false,
      },
      orderBy: {
        vintage: 'asc',
      },
    });

    return targetYear.vintage;
  }

  /**
   * @param neededCC the number of carbon credits needed
   * @returns the list of carbon credits id to retire
   */
  async findStockToRetire(neededCC: number): Promise<RetireStockDto[]> {
    const currentYear = new Date().getFullYear();
    const targetStock = await this.prisma.carbonCredit.findMany({
      take: neededCC,
      select: {
        id: true,
      },
      where: {
        isRetired: false,
        vintage: {
          lte: currentYear.toString(),
        },
        auditStatus: 'AUDITED',
      },
      orderBy: {
        vintage: 'asc',
      },
    });

    return targetStock;
  }
}
