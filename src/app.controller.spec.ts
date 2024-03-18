import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'nestjs-prisma';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './user/user.module';
import { StockModule } from './stock/stock.module';
import { ProjectModule } from './project/project.module';
import { OrderModule } from './order/order.module';
import { PriceModule } from './price/price.module';
import { TransactionModule } from './transaction/transaction.module';
import { CertificateModule } from './certificate/certificate.module';
import { CronjobsModule } from './cronjobs/cronjobs.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule.forRoot({ isGlobal: true }),
        ScheduleModule.forRoot(),
        UsersModule,
        StockModule,
        ProjectModule,
        OrderModule,
        PriceModule,
        TransactionModule,
        CertificateModule,
        CronjobsModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
