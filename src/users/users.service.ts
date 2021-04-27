import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.models';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'red',
      password: 'red',
    },
    {
      userId: 2,
      username: 'blue',
      password: 'blue',
    },
  ];

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findOne(userName: string): Promise<User> {
    let user;

    try {
      user = await this.userModel.find({ userName }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }

    return user;
  }

  async findUser(id: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
    if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }

  async addUser(
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    const newUser = new this.userModel({
      userName,
      firstName,
      lastName,
      email,
      password,
    });

    const result = await newUser.save();

    return result;
  }
}
