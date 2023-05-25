import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { IndContentService } from 'src/ind-content/ind-content.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { defaultINDAPIPayload } from 'src/query-builder/query-builder.service';
import { IND_DESKS_LABELS } from 'src/types/ind-desks';
import { IND_SERVICES_LABELS } from 'src/types/ind-services';
import { UserService } from 'src/user/user.service';
// import { CreateNotificationDto } from './notification.dto';
// import { Notification, NotificationDocument } from './notification.schema';
import * as dayjs from 'dayjs';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import {
  Verification,
  VerificationDocument,
} from './schemas/verification.schema';

@Injectable()
export class VerificationPushService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Verification.name)
    private verificationModel: Model<VerificationDocument>,
    private messengerService: MessengerService,
    private userService: UserService,
  ) {}

  generateVerifcaionCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }
  async generateVerifcaionCodeAndUpdateUser(userId: string) {
    const code = this.generateVerifcaionCode();
    await this.verificationModel.create({});
  }

  sendVerificationEmail = (user) => {
    const payload = {
      verificationCode: this.generateVerifcaionCode(),
    };
    this.messengerService.sendVerificationEmail(user);
  };

  async verifyUserEmail(userId: string) {
    try {
      await this.userModel.findByIdAndUpdate(userId, {
        isVerified: true,
      });
      const user = await this.userService.findUserById(userId);
      return user;
    } catch (e) {
      return null;
    }
  }
  verifyUserByPush(data) {
    // this.userModel.
  }
}
