// import { Module } from '@nestjs/common';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from './user.schema';
// import { JwtModule } from '@nestjs/jwt';

// @Module({
//     imports: [
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
//     JwtModule.register({ // ✅ Configure the JWT module
//       secret: 'your-secret-key', // ideally from env file
//       signOptions: { expiresIn: '1h' },
//     }),
//   ],
//   controllers: [UsersController],
//   providers: [UsersService],
// })
// export class UsersModule {}


import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
