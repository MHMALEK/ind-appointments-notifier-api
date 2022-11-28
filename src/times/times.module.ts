import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotifierAppoinment,
  NotifierAppoinmentSchema,
} from 'src/new-appointment-notifier/schemas/appointmentNotifier.schema';
import { Time, TimeSchema } from 'src/user/schemas/time.schema';
import { TimesService } from './times.service';

@Module({
  providers: [TimesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Time.name,
        schema: TimeSchema,
      },
      { name: NotifierAppoinment.name, schema: NotifierAppoinmentSchema },
    ]),
  ],
  exports: [
    TimesService,
    MongooseModule.forFeature([
      {
        name: Time.name,
        schema: TimeSchema,
      },
      { name: NotifierAppoinment.name, schema: NotifierAppoinmentSchema },
    ]),
  ],
})
export class TimesModule {}
