import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    // return this.usersService.createUser(createUserDto)
  }

  @Get('/:id')
  findUser(@Param('id') id: number) {
    // return this.usersService.findUser(id)
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    // return this.usersService.findAllUsers(email)
  }

  @Patch('/:id')
  upddateUser(@Param('id') id: number) {
    // return this.usersService.upddateUser(id)
  }

  @Delete('/:id')
  removeUser(@Param('id') id: number) {
    // return this.usersService.removeUser(id)
  }
}
