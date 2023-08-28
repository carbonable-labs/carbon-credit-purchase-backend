import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export const USER_SERVICE = 'USER SERVICE';

export interface IUserService {
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User>;
  create(user: CreateUserDto): Promise<CreateUserDto>;
  update(id: string, user: UpdateUserDto): Promise<UpdateUserDto>;
  remove(id: string): Promise<string>;
}
