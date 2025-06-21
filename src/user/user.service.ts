import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: User) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll() {
    return this.userModel.find({}, '-password -__v').exec();
  }

  async findOne(id: string) {
    return this.userModel.findOne({ _id: id }, '-password -__v').exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      email: email,
    });
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete({ _id: id }).exec();
  }

  async update(id: string, user: Partial<User>) {
    return this.userModel.findByIdAndUpdate({ _id: id }, user, {
      new: true,
    });
  }
}
