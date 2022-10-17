import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { userInterface } from '@turbo-lottery/data';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<userInterface>
  ) {}

  checkId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }
  }

  async create(body: CreateUserDto) {
    try {
      const user = new this.userModel({
        username: body.username,
        password: body.password,
        credit: body.credit,
        isAdmin: body.isAdmin,
        creditHistory: [
          {
            description: 'Initialized Credit',
            transaction: '+1000',
            balance: '1000',
          },
        ],
      });
      const savedUser = await user.save();
      const { _id, username } = savedUser;
      // status: true,
      return { _id, username };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('User Already Exist');
        // return { status: false, message: 'User Already Exist' };
      }

      throw new InternalServerErrorException(error);
      // return { status: false, message: error };
    }
  }

  async getAll() {
    try {
      const users = await this.userModel.find();
      if (!users || users.length === 0) {
        throw new NotFoundException('Users Not Found');
      } else {
        return users;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async get(userId: string) {
    this.checkId(userId);
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User Not Found');
      } else {
        return user;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(username: string) {
    try {
      const user = await this.userModel.findOne({ username: username });
      if (!user) {
        // throw new NotFoundException('User Not Found');
        return null;
      } else {
        return user;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(userId: string, body: UpdateUserDto) {
    // this.checkId(userId);
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $set: { ...body },
        },
        { new: true }
      );
      if (!user) {
        throw new NotFoundException('User Not Found');
      } else {
        return user;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addCredit(userId: string, body: UpdateUserDto) {
    this.checkId(userId);
    try {
      const user = await this.get(userId);
      user.credit += body.credit;
      const balance = user.credit;
      user.creditHistory.push({
        description: 'Added by Admin',
        transaction: `+${body.credit}`,
        balance: `${balance}`,
      });

      const updateUser = await this.update(userId, user);
      const { _id, credit, username } = updateUser;
      return { _id, username, credit };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(userId: string) {
    this.checkId(userId);
    try {
      const user = await this.userModel.findByIdAndDelete(userId);
      if (!user) {
        throw new NotFoundException('User Not Found');
      } else {
        return { msg: 'User Deleted Successfully' };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
