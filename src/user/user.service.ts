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
  findUserByFireBaseUserId(data: { firebase_user_id: string }): Promise<User> {
    return this.userModel
      .findOne({
        firebase_user_id: data.firebase_user_id,
      })
      .exec();
  }
  async unsubscribeAndRemoveNotificationsForOneService(notificationId: string) {
    await this.notificationService.deleteOneNotificationForUser(notificationId);
  }

  async unsubscribeAndRemoveAllNotificationsAndUser(notificationId: string) {
    try {
      const user = await this.notificationService.findUserByNotificationId(
        notificationId,
      );

      console.log('user', user);

      await this.userModel.deleteOne({
        firebase_user_id: user.firebase_user_id,
      });
      await this.notificationService.deleteAllNotificationsForUser(
        user.firebase_user_id,
      );
    } catch (e: any) {
      throw new Error(e);
    }
  }
}
