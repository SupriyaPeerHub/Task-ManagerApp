// import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';

// import { TasksModule } from './tasks/tasks.module';
// import { LoggerMiddleware } from './common/middleware/logger.middleware';

// @Module({
//   imports: [
//     MongooseModule.forRoot(
//       'mongodb+srv://supriyahaldar:gHEEdF8aP9F9pouc@cluster0.g3sca6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
//     ),
//     AuthModule,
//     UsersModule,
//     TasksModule,
//   ],
// })
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes('*');
//   }
// }


// import { Module, NestModule, MiddlewareConsumer, OnModuleInit, Logger, Inject } from '@nestjs/common';
// import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
// import { Connection } from 'mongoose';

// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { TasksModule } from './tasks/tasks.module';
// import { LoggerMiddleware } from './common/middleware/logger.middleware';

// @Module({
//   imports: [
//     MongooseModule.forRoot(
//       'mongodb+srv://supriyahaldar:gHEEdF8aP9F9pouc@cluster0.g3sca6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
//     ),
//     AuthModule,
//     UsersModule,
//     TasksModule,
//   ],
// })
// export class AppModule implements NestModule, OnModuleInit {
//   private readonly logger = new Logger(AppModule.name);

//   constructor(
//     // Inject mongoose connection
//     @Inject(getConnectionToken()) private readonly connection: Connection,
//   ) {}

//   onModuleInit() {
//     this.connection.once('open', () => {
//       this.logger.log('MongoDB connection established successfully!');
//       console.log('MongoDB connection successfully!')
//     });

//     this.connection.on('error', (err) => {
//       this.logger.error(`MongoDB connection error: ${err}`);
//     });
//   }

//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes('*');
//   }
// }



import { Module, NestModule, MiddlewareConsumer, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // enable .env
    MongooseModule.forRootAsync({ 
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
    }),
    AuthModule,
    UsersModule,
    TasksModule,
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(@Inject(getConnectionToken()) private readonly connection: Connection) {} 

  onModuleInit() {
    this.connection.once('open', () => {
      console.log('MongoDB connection successfully!');
      this.logger.log('MongoDB connection established successfully!');
    });

    this.connection.on('error', (err) => {
      this.logger.error(`MongoDB connection error: ${err}`);
    });
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
