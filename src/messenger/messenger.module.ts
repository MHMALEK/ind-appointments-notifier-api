import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';

@Module({
  providers: [MessengerService],
  imports: [HttpModule],
  exports: [HttpModule, MessengerService],
})
export class MessengerModule {}
