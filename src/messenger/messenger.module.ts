import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';

@Module({
  providers: [MessengerService]
})
export class MessengerModule {}
