// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: 'oguVIkCCZQs2lAckYnZVYLLW0r5RjL75',
//     });
//   }

//   async validate(payload: any) {
//     return { userId: payload.sub, role: payload.role };
//   }
// // }
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly configService: ConfigService) {
//     const secret = configService.get<string>('JWT_SECRET');
//     if (!secret) {
//       throw new Error('JWT_SECRET is not defined in the environment variables');
//     }

//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: secret,
//     });
//   }

//   // async validate(payload: any) {
//   //   console.log('Supriya', payload.userID, payload.role);
//   //   return { userId: payload.userID, role: payload.role };
//   // }

//   async validate(payload: any) {
//     console.log('Supriya', payload.sub, payload.role);
//     return { userId: payload.sub, role: payload.role };
//   }
// }




import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    // Optional safety check
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret as string, // <- assertion fixes the type error
    });
  }

  async validate(payload: any) {
    console.log('Supriya', payload.sub, payload.role);
    return { userId: payload.sub, role: payload.role };
  }
}
