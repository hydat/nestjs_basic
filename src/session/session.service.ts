import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  RemoveOptions,
  Repository,
} from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async find(options: FindOneOptions): Promise<Session | null> {
    return await this.sessionRepository.findOne(options);
  }

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create(createSessionDto);
    return await this.sessionRepository.save(session);
  }

  async remove(entity: Session, options?: RemoveOptions): Promise<Session> {
    return await this.sessionRepository.remove(entity, options);
  }

  async delete(criteria: FindOptionsWhere<Session>): Promise<DeleteResult> {
    return await this.sessionRepository.delete(criteria);
  }
}
