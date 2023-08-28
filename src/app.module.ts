import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import {
  PrismaModule,
  providePrismaClientExceptionFilter,
} from 'nestjs-prisma';

@Module({
  imports: [PrismaModule.forRoot({ isGlobal: true }), UsersModule],
  controllers: [AppController],
  providers: [providePrismaClientExceptionFilter(), AppService],
})
export class AppModule {}
