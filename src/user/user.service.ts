import { Injectable } from '@nestjs/common';
import { IUserService } from './user.interface';
import { PrismaService } from 'nestjs-prisma';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(private prisma: PrismaService) {}

  create(user: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: user });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(id: string): Promise<User> {
    return this.prisma.user.findFirstOrThrow({
      where: {
        OR: [{ id }, { email: id }],
      },
    });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({ where: { email } });
  }

  update(id: string, user: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: user });
  }

  async remove(id: string): Promise<string> {
    await this.prisma.user.delete({ where: { id } });
    return id;
  }
}
