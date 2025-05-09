import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from './email/email.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UploadModule } from './upload/upload.module';
import minioConfig from './config/minio.config';

dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👉 để dùng ở bất kỳ đâu
      envFilePath: '.env', // 👉 nếu dùng file tên khác, chỉnh ở đây
      load: [minioConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST, // Lấy từ process.env
      port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations',
      synchronize: process.env.NODE_ENV === 'test',
      dropSchema: process.env.NODE_ENV === 'test',
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
      },
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 30000,
          limit: 10,
        },
      ],
    }),
    UserModule,
    PostModule,
    AuthModule,
    CronModule,
    EmailModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
