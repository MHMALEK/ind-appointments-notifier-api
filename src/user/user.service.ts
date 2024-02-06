import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './create_new_user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}
  saveUserToDb(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }
  findUserByFireBaseUserId(data: {
    firebase_user_id?: string;
    telegram_chat_id?: string;
  }): Promise<User> {
    let query;

    if (data.firebase_user_id && !data.telegram_chat_id) {
      query = { firebase_user_id: data.firebase_user_id };
    } else if (data.telegram_chat_id && !data.firebase_user_id) {
      query = { telegram_chat_id: data.telegram_chat_id };
    } else if (data.telegram_chat_id && data.firebase_user_id) {
      query = {
        $or: [
          { firebase_user_id: data?.firebase_user_id },
          { telegram_chat_id: data?.telegram_chat_id },
        ],
      };
    }

    return this.userModel.findOne(query).exec();
  }
  async unsubscribeAndRemoveNotificationsForOneService(notificationId: string) {
    try {
      await this.notificationService.deleteOneNotificationForUser(
        notificationId,
      );
      return 'you have been unsubscribed from this notification';
    } catch (e: any) {
      throw new Error(
        'there was an error unsubscribing you from this service, please try again later or contact support' +
          e,
      );
    }
  }

  async unsubscribeAndRemoveAllNotificationsAndUser(notificationId: string) {
    try {
      const user = await this.notificationService.findUserByNotificationId(
        notificationId,
      );

      await this.userModel.deleteOne({
        firebase_user_id: user.firebase_user_id,
      });
      await this.notificationService.deleteAllNotificationsForUser(
        user.firebase_user_id,
      );
      return 'you have been unsubscribed from all notifications';
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async setPushToken(token: string, user_id: string, email: string) {
    try {
      if (!token || !user_id || !email)
        throw new Error('token or user_id or email is not provided');

      let user;
      const isUserAlreadyRegistered = (await this.findUserByFireBaseUserId({
        firebase_user_id: user_id,
      })) as UserDocument;

      if (isUserAlreadyRegistered) {
        user = isUserAlreadyRegistered;
      } else {
        user = await this.saveUserToDb({
          email,
          pushToken: token,
          firebase_user_id: user_id,
        });
      }

      user.pushToken = token;

      await user.save();
      return 'success';
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async deleteUserAndAllNotifications(user_id: string) {
    try {
      if (!user_id) throw new Error('user_id  is not provided');

      const isUserAlreadyRegistered = (await this.findUserByFireBaseUserId({
        firebase_user_id: user_id,
      })) as UserDocument;

      if (isUserAlreadyRegistered) {
        await this.notificationService.deleteAllNotificationsForUser(user_id);
        await isUserAlreadyRegistered.remove();
        return 'success';
      } else {
        throw new Error('user Not found');
      }
    } catch (e: any) {
      throw new Error(e);
    }
  }
}
