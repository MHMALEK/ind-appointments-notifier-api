import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { IndContentService } from 'src/ind-content/ind-content.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { TimesModule } from 'src/times/times.module';
import { TimesService } from 'src/times/times.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { NewAppointmentNotifierController } from './new-appointment-notifier.controller';
import { NewAppointmentNotifierService } from './new-appointment-notifier.service';
import {
  NotifierAppoinment,
  NotifierAppoinmentSchema,
} from './schemas/appointmentNotifier.schema';

@Module({
  controllers: [NewAppointmentNotifierController],
  providers: [
    NewAppointmentNotifierService,
    AppointmentsService,
    TimesService,
    MessengerService,
    UserService,
    IndContentService,
  ],
  imports: [
    AppointmentsModule,
    TimesModule,
    MongooseModule.forFeature([
      {
        name: NotifierAppoinment.name,
        schema: NotifierAppoinmentSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class NewAppointmentNotifierModule {}
