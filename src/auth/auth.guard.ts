import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { extractTokenFromHeader } from 'src/common/helper/common';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }

      const tokenDecode = this.jwtService.decode(token);
      const session = await this.sessionService.find({
        where: {
          id: tokenDecode.sessionId,
        },
      });
      if (!session) {
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
