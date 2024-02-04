import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsModule } from './appointments/appointments.module';
import { QueryBuilderModule } from './query-builder/query-builder.module';
import { UserModule } from './user/user.module';
import { MessengerModule } from './messenger/messenger.module';
import { IndContentModule } from './ind-content/ind-content.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import * as firebaseAdmin from 'firebase-admin';
import { MailModule } from './mail/mail.module';
import { SmsModule } from './sms/sms.module';
import { PushNotificationModule } from './push-notification/push-notification.module';
import * as serviceAccount from 'src/ind-application-af6db-firebase-adminsdk-vyg7c-87a3b1a018.json';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://vfs-data-base-user:Ka723wQHWtwQXf7A@cluster0.uqiqnc2.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'appointments' },
    ),
    AppointmentsModule,
    QueryBuilderModule,
    MessengerModule,
    IndContentModule,
    NotificationModule,
    UserModule,
    MailModule,
    SmsModule,
    PushNotificationModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    const firebaseConfig = {
      apiKey: 'AIzaSyCsDRB7TLw2mrxp7znUsuQ-C2DjQtSPbL8',
      authDomain: 'ind-application-af6db.firebaseapp.com',
      projectId: 'ind-application-af6db',
      storageBucket: 'ind-application-af6db.appspot.com',
      messagingSenderId: '419666471833',
      appId: '1:419666471833:web:7e9ceabf1d1025e5fac108',
      measurementId: 'G-1Z7YXX4JT6',
    };
    const app = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(
        serviceAccount as firebaseAdmin.ServiceAccount,
      ),
      ...firebaseConfig,
    });
    return app;
  }
}
