import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UsePipes,
  ValidationPipe,
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

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly _usersService: IUserService,
  ) {}

  @ApiOperation({ summary: 'Get a user with its email' })
  @ApiOkResponse({
    description: 'Return a specific user based on its email',
    type: User,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<User> {
    const user = await this._usersService.findOneByEmail(email);

    return user;
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    type: User,
    description: 'The user has been successfully created.',
  })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    return await this._usersService.create(user);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Return all users.' })
  @Get()
  findAll(): Promise<User[]> {
    return this._usersService.findAll();
  }

  @ApiOperation({ summary: 'Get a user with its id or its email' })
  @ApiOkResponse({
    description: 'Return a specific user based on its id or its email',
    type: User,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this._usersService.findOne(id);

    return user;
  }

  @ApiOkResponse({ description: 'The user was updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<User> {
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
