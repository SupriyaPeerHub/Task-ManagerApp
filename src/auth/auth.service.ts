import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { UserRole } from 'src/interfaces/user-role.enum';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = new this.userModel({
        ...dto,
        password: hashedPassword,
        type: UserRole.USER,
      });
      const RegistratedUser = await user.save();
      return { message: 'Registration successful', data: RegistratedUser };
    } catch (err) {
      console.log(err);
      return { message: 'Inernal server error', data: err };
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      // console.log(user);
      if (!user) {
        return { message: 'User not found', data: null };
      }
      const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordMatch) {
        return { message: 'Invalid credentials', data: null };
      }
      const payload = { sub: user._id, role: user.type };
      const token = this.jwtService.sign(payload);
      return { message: 'Login successful', data: { token } };
    } catch (err) {
      console.log(err);
      return { message: 'Inernal server error', data: err };
    }
  }
}
