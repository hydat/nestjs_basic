import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SessionModule } from 'src/session/session.module';
import { UserListener } from './user.listener';
import Redis from 'ioredis';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SessionModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserListener,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        });
      },
    },
  ],
  exports: [UserService],
})
export class UserModule {}
