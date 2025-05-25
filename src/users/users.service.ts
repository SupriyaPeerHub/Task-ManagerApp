import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';


@Injectable()
export class UsersService {
  constructor(
      @InjectModel(User.name) private userModel: Model<User>,
      private jwtService: JwtService,
    ) {}

    async getAllUsers(){
        const users = await this.userModel.find().select('-password');;
        return {message: 'All users', data: users};
    }
}
