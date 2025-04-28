import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [SessionModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
