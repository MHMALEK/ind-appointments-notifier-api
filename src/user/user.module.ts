import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { DbService } from 'src/db/db.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Time, TimeSchema } from './schemas/time.schema';
import { TimesService } from 'src/times/times.service';
import {
  NotifierAppoinment,
  NotifierAppoinmentSchema,
} from 'src/new-appointment-notifier/schemas/appointmentNotifier.schema';

@Module({
  providers: [UserService, DbService, TimesService],
  imports: [
    DbModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: NotifierAppoinment.name,
        schema: NotifierAppoinmentSchema,
      },
      {
        name: Time.name,
        schema: TimeSchema,
      },
    ]),
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
