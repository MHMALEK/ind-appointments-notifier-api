import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { UserModule } from 'src/user/user.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { IndContentModule } from 'src/ind-content/ind-content.module';
import { MessengerModule } from 'src/messenger/messenger.module';
import { HttpModule } from '@nestjs/axios';
import { AuthenticationMiddleware } from 'src/middlewares/auth';

@Module({
  providers: [NotificationService],
  controllers: [NotificationController],
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    AppointmentsModule,
    IndContentModule,
    MessengerModule,
    HttpModule,
  ],
  exports: [NotificationService],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(NotificationController);
  }
}
