import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PostListener {
  @OnEvent('user.list')
  async handleUserList(payload: any) {
    let retry = 3;
    while (retry > 0) {
      try {
        console.log('asdasdasd', payload);
        // Xử lý logic chính ở đây
        return;
      } catch (error) {
        console.error('Error processing event, retries left:', retry - 1);
        retry--;
        if (retry === 0) throw error;
      }
    }
  }
}
