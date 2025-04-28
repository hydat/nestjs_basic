import {
  Headers,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, LoginResponse } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/session/session.service';
import * as dayjs from 'dayjs';
import { extractTokenFromHeader } from 'src/common/helper/common';
import { AuthResponse } from './interface/auth.interface';
import { ICommonRequest } from 'src/common/interfaces/system';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from 'src/user/entities/user.entity';
import { ETokenTypes } from './enum/token-type.enum';
import { Session } from 'src/session/entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.login(loginDto);
    const accessToken = await this.createToken(user, ETokenTypes.ACCESS);
    const refreshToken = await this.createToken(user, ETokenTypes.REFRESH);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async logout(request: ICommonRequest): Promise<boolean> {
    try {
      const user = request.user;

      const session = await this.sessionService.find({
        where: { id: user?.sessionId },
      });

      if (!session) {
        throw new NotFoundException('Session not found');
      }

      await this.sessionService.remove(session);
      return true;
    } catch {
      return false;
    }
  }

  async forceLogout(request: ICommonRequest): Promise<boolean> {
    try {
      const { user } = request;

      await this.sessionService.delete({ userId: user?.userId });
      return true;
    } catch {
      return false;
    }
  }

  async adminForceLogout(request: ICommonRequest): Promise<boolean> {
    try {
      const { user } = request;

      await this.sessionService.delete({ userId: user?.userId });
      return true;
    } catch {
      return false;
    }
  }

  async refresh(
    request: ICommonRequest,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponse> {
    try {
      const { refreshToken: currentRefreshToken } = refreshTokenDto;
      const refreshPayload = await this.jwtService.verifyAsync(
        currentRefreshToken,
        {
          secret: process.env.JWT_REFRESH,
        },
      );
      const user = await this.userService.getUserById(refreshPayload.userId);
      const accessToken = await this.createToken(user, ETokenTypes.ACCESS);
      const refreshToken = await this.createToken(user, ETokenTypes.REFRESH);

      const accessTokenDecode = this.jwtService.decode(
        extractTokenFromHeader(request),
      );
      await this.deleteSession(accessTokenDecode.sessionId);
      await this.deleteSession(refreshPayload.sessionId);

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async createToken(user: User, type: ETokenTypes): Promise<string> {
    try {
      const expiredTime =
        type === ETokenTypes.ACCESS ? 1 * 60 * 60 : 1 * 60 * 60 * 24;
      const secretKey =
        type === ETokenTypes.ACCESS
          ? process.env.JWT_SECRET
          : process.env.JWT_REFRESH;

      const session = await this.sessionService.create({
        userId: user.id,
        expiredDate: dayjs().add(expiredTime, 'second').toDate(),
      });
      const payload: AuthResponse = {
        userId: user.id,
        role: user.role,
        sessionId: session.id,
      };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: `${expiredTime}s`,
        secret: secretKey,
      });
      return token;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async deleteSession(id: Session['id']): Promise<boolean> {
    try {
      const session = await this.sessionService.find({
        where: { id },
      });

      if (!session) {
        throw new NotFoundException('Session not found');
      }
      await this.sessionService.remove(session);
      return true;
    } catch {
      return false;
    }
  }
}
