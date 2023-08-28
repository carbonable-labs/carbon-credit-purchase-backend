import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpException,
} from '@nestjs/common';
import { IUserService, USER_SERVICE } from './user.interface';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly _usersService: IUserService,
  ) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    type: CreateUserDto,
    description: 'The user has been successfully created.',
  })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Post()
  async create(@Body() user: CreateUserDto): Promise<CreateUserDto> {
    return await this._usersService.create(user);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Return all users.' })
  @Get()
  async findAll(): Promise<User[]> {
    return await this._usersService.findAll();
  }

  @ApiOperation({ summary: 'Get a users with its id' })
  @ApiOkResponse({
    description: 'Return a specific user based on its id',
    type: User,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this._usersService.findOne(id);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  @ApiOkResponse({ description: 'The user was updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this._usersService.update(id, user);
  }

  @ApiOkResponse({ description: 'The user was deleted successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<string> {
    return this._usersService.remove(id);
  }
}
