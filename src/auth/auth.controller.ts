import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/interfaces/RequestWithUser';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() RegisterDto: RegisterDto) {
    // console.log("RegisterDto", RegisterDto);
    return this.authService.register(RegisterDto);
  }

  @Post('login')
  async login(@Body() LoginDto: LoginDto) {
    // console.log("LoginDto", LoginDto);
    return this.authService.login(LoginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  async logout(@Req() req: RequestWithUser) {
    const userId = req.user?.userId;
    console.log('Userid', userId, typeof userId);
    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }
    console.log('Userid', userId);
    return this.authService.logout(userId);
  }

  @Post('refresh-token')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshTokens(body.refreshToken);
  }
}

// 1. Shorthand syntax
// constructor(private readonly authService: AuthService) {}

//2.  Without this shorthand, you would write:
// private readonly authService: AuthService;
// constructor(authService: AuthService) {
//   this.authService = authService;
// }
