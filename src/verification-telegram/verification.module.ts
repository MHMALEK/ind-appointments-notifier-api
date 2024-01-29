// import { Module } from '@nestjs/common';
// import { NotificationService } from './verification.service';
// import { NotificationController } from './verification.controller';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Notification, NotificationSchema } from './notification.schema';
// import { UserModule } from 'src/user/user.module';
// import { AppointmentsService } from 'src/appointments/appointments.service';
// import { IndContentService } from 'src/ind-content/ind-content.service';
// import { MessengerService } from 'src/messenger/messenger.service';
// import { HttpModule } from '@nestjs/axios';
// import { AppointmentsModule } from 'src/appointments/appointments.module';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { VerificationController } from './verification.controller';

@Module({
  // providers: [
  //   NotificationService,
  //   AppointmentsService,
  //   IndContentService,
  //   MessengerService,
  // ],
  controllers: [VerificationController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  //   UserModule,
  //   AppointmentsModule,
  // ],
  // exports: [NotificationService],
})
export class NotificationModule {}
