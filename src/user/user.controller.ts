import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ERoles } from 'src/common/enum/role.enum';
import { ResponseFormatInterceptor } from 'src/common/interceptors/response-format.interceptor';

@Controller('users')
@UseInterceptors(ResponseFormatInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles(ERoles.ADMIN, ERoles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  getAllUsers() {
    return this.userService.getUsers();
  }

  @Roles(ERoles.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Roles(ERoles.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(ERoles.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Post('logout')
  logout() {}
}
