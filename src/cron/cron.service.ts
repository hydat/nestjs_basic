import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { SessionService } from 'src/session/session.service';
import { LessThan } from 'typeorm';

@Injectable()
export class CronService {
  constructor(private readonly sessionService: SessionService) {}
  //   @Cron('*/20 * * * * *')
  //   runLogic() {
  //     try {
  //       const expiredSpot = dayjs().toDate();
  //       this.sessionService.delete({ expiredDate: LessThan(expiredSpot) });
  //       console.log('Called when the current second is 45 OR when server starts');
  //     } catch {
  //       console.log('cron job error');
  //     }
  //   }
}
