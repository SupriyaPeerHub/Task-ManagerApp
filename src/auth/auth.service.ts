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
      // const payload = { userID: user._id, role: user.type };
      const payload = {
        _id: user._id,
        type: user.type,
        email: user.email,
      };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' }); // Shorter lifetime
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // long-lived

      // Save hashed refreshToken in DB
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      user.refreshToken = hashedRefreshToken;
      await user.save();

      return {
        message: 'Login successful',
        data: {
          accessToken,
          refreshToken,
        },
      };
    } catch (err) {
      console.log(err);
      return { message: 'Inernal server error', data: err };
    }
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded: any = this.jwtService.decode(refreshToken);
      const userId = decoded?.userID;

      if (!userId) {
        return { message: 'Invalid token', data: null };
      }

      const user = await this.userModel.findById(userId);
      if (!user || !user.refreshToken) {
        return { message: 'Unauthorized', data: null };
      }

      const isTokenMatching = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isTokenMatching) {
        return { message: 'Refresh token mismatch', data: null };
      }

      // Generate new tokens
      const payload = { userID: user._id, role: user.type };
      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });
      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      // Store new refresh token (hashed)
      user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
      await user.save();

      return {
        message: 'Tokens refreshed successfully',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (err) {
      console.log(err);
      return { message: 'Internal server error', data: null }; 
    }
  }
}
