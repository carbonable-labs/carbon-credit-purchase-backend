import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { USER_SERVICE } from './user.interface';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    PrismaModule,
  ],
})
export class UsersModule {}
