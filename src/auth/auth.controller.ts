import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
}

// 1. Shorthand syntax
// constructor(private readonly authService: AuthService) {}

//2.  Without this shorthand, you would write:
// private readonly authService: AuthService;
// constructor(authService: AuthService) {
//   this.authService = authService;
// }
