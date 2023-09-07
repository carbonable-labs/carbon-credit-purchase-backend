import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import {
  PrismaModule,
  providePrismaClientExceptionFilter,
} from 'nestjs-prisma';
import { StockModule } from './stock/stock.module';
import { ProjectModule } from './project/project.module';
import { OrderModule } from './order/order.module';
import { TransactionModule } from './transaction/transaction.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobsModule } from './cronjobs/cronjobs.module';
import { PriceModule } from './price/price.module';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    UsersModule,
    StockModule,
    ProjectModule,
    OrderModule,
    PriceModule,
    TransactionModule,
    CronjobsModule,
  ],
  controllers: [AppController],
  providers: [providePrismaClientExceptionFilter(), AppService],
})
export class AppModule {}
