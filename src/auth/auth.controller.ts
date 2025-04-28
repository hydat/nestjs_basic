import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponse } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ERoles } from 'src/common/enum/role.enum';
import { ICommonRequest } from 'src/common/interfaces/system';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(ValidationPipe) loginUserDto: LoginDto,
  ): Promise<LoginResponse> {
    return await this.authService.login(loginUserDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Request() request: ICommonRequest): Promise<boolean> {
    return await this.authService.logout(request);
  }

  @Post('logout/force')
  @UseGuards(AuthGuard)
  async forceLogout(@Request() request: ICommonRequest): Promise<boolean> {
    return await this.authService.forceLogout(request);
  }

  @Post('logout/force/admin')
  @Roles(ERoles.ADMIN)
  @UseGuards(AuthGuard)
  async adminForceLogout(@Request() request: ICommonRequest): Promise<boolean> {
    return await this.authService.adminForceLogout(request);
  }

  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() request: ICommonRequest,
  ): Promise<LoginResponse> {
    return await this.authService.refresh(request, refreshTokenDto);
  }
}
