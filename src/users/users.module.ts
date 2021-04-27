import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersSchema } from './user.models';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UsersSchema }])],
})
export class UsersModule {}
