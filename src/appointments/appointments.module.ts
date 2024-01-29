import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { QueryBuilderService } from 'src/query-builder/query-builder.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { IndContentService } from 'src/ind-content/ind-content.service';

@Module({
  providers: [
    AppointmentsService,
    QueryBuilderService,
    MessengerService,
    IndContentService,
  ],
  imports: [HttpModule],
  controllers: [AppointmentsController],
  exports: [AppointmentsService, QueryBuilderService, HttpModule],
})
export class AppointmentsModule {}
