import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { comparePassword, hashPassword } from 'src/common/helper/hash.helper';
import { LoginDto } from 'src/auth/dto/login.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import { ERoles } from 'src/common/enum/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async getUsers(): Promise<User[]> {
    this.eventEmitter.emitAsync('user.list', { username: 'aaaa' });
    const cachedData = await this.redisClient.get('list_user');
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const users = await this.userRepository.find();
    await this.redisClient.set('list_user', JSON.stringify(users));
    return users;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashPassword(createUserDto.password),
      role: ERoles.USER, // default role User
    });

    return await this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const entity = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return await this.userRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    //
    await this.userRepository.remove(user);
  }

  async login(loginDto: LoginDto): Promise<User> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`user not found`);
    }

    if (!comparePassword(password, user.password)) {
      throw new NotFoundException(`Password invalid`);
    }

    return user;
  }
}
