import { Injectable } from '@nestjs/common';
import { IUserService } from './user.interface';
import { PrismaService } from 'nestjs-prisma';
import { User } from './entities/user.entity';

@Injectable()
export class UserService implements IUserService {
  constructor(private prisma: PrismaService) {}
  create(user: User): Promise<User> {
    return this.prisma.user.create({ data: user });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: string, user: User): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: user });
  }

  async remove(id: string): Promise<string> {
    await this.prisma.user.delete({ where: { id } });
    return id;
  }
}
