import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SessionModule } from 'src/session/session.module';
import { UserListener } from './user.listener';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SessionModule],
  controllers: [UserController],
  providers: [UserService, UserListener],
  exports: [UserService],
})
export class UserModule {}
