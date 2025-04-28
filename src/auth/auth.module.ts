import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      // secret: process.env.JWT_SECRET,
    }),
    SessionModule,
  ],
  providers: [AuthService],
  exports: [AuthService], // để dùng ở module khác
  controllers: [AuthController],
})
export class AuthModule {}
