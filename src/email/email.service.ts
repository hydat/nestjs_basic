import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private count = 0;
  private readonly transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  constructor(@InjectQueue('email-queue') private readonly emailQueue: Queue) {}

  async sendVerificationEmail(email: string) {
    await this.emailQueue.add(
      'send-verification',
      { email },
      {
        delay: 5000,
        jobId: email,
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
      }, // Job trùng ID sẽ không bị tạo lại
    );
  }

  async verificationEmail(to: string) {
    if (this.count < 2) {
      // test retry, gui lan 3 thi moi thanh cong
      this.count++;
      throw new Error(`loi gui mail ne ${this.count}`);
    }
    await this.transporter.sendMail({
      from: '"My App" <no-reply@example.com>',
      to,
      subject: 'Xác thực tài khoản',
      html: `<p>Chào bạn,<br/>Vui lòng xác thực email này bằng cách nhấn vào liên kết xác thực.</p>`,
    });
  }
}
