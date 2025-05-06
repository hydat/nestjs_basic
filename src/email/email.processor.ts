import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from './email.service';

@Processor('email-queue')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }
  override async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'send-verification') {
      const { email } = job.data;
      console.log(`📧 Gửi email xác thực đến: ${email}`);
      await this.emailService.verificationEmail(email);
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Job ${job.id} is active`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const maxAttempts = job.opts.attempts ?? 1;

    if (job.attemptsMade >= maxAttempts) {
      console.log(`Job ${job.id} failed sau tat ca cac lan retry`);
    } else {
      console.log(`Job ${job.id} failed lan thu ${job.attemptsMade}`);
    }
  }
}
