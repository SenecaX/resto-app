import { UsersService } from './users.service';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpStatus,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async addUser(
    @Body('userName') userName: string,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.usersService.addUser(
      userName,
      firstName,
      lastName,
      email,
      password,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'User added successfully',
      data: user,
    };
  }
}
