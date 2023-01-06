import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateNotificationDto } from './notification.dto';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private userService: UserService,
  ) {}
  async createNewnotification(createNotificationDto: CreateNotificationDto) {
    // console.log('createNotificationDto', createNotificationDto);

    const user = await this.findUserWhoCreateNotification(
      createNotificationDto,
    );

    if (user) {
      if (!user.isVerified) {
        // send verification
        return 'user is not verifed yet';
      } else {
        const notificationExistAlready = await this.findnotificationsForUser({
          userId: user.id,
          desk: createNotificationDto.desk,
          service: createNotificationDto.service,
          date: createNotificationDto.date,
        });

        if (notificationExistAlready) {
          const updatedNotification = await this.updateNotification({
            userId: user.id,
            desk: createNotificationDto.desk,
            service: createNotificationDto.service,
            date: createNotificationDto.date,
          });
          return updatedNotification;
        } else {
          try {
            const creatednotification = new this.notificationModel({
              userId: user.id,
              desk: createNotificationDto.desk,
              service: createNotificationDto.service,
              date: createNotificationDto.date,
            });
            const createdNotificationRes = await creatednotification.save();
            return createdNotificationRes;
          } catch (e) {
            throw new Error('something went wrong');
          }
        }
      }
    }
    if (!user) {
      const newUser = await this.userService.createNewUser({
        telegramId: createNotificationDto.telegramId,
        email: createNotificationDto.email,
      });

      if (!newUser.isVerified) {
        return 'you need to verify your email first';
      } else {
        const creatednotification = new this.notificationModel({
          userId: newUser.id,
          desk: createNotificationDto.desk,
          service: createNotificationDto.service,
          date: createNotificationDto.date,
        });
        return creatednotification.save();
      }
    }
  }

  async findUserWhoCreateNotification({ email, telegramId }) {
    const user = await this.userService.findUserByTelegramOrEmail({
      email,
      telegramId,
    });
    if (!user) {
      return null;
    }
    return user;
  }
  async findnotificationsForUser({ userId, service, date, desk }) {
    const notification = await this.notificationModel.findOne({
      userId: userId,
      service,
      date,
      desk,
    });

    return notification;
  }

  async updateNotification({ userId, service, date, desk }) {
    const notification = await this.notificationModel.findOneAndUpdate({
      userId: userId,
      service,
      date,
      desk,
    });
    return notification;
  }

  async getnotificationsList() {
    const notifications = await this.notificationModel.find();
  }
  async findNotificationForSpeceficHouse(houseId: string) {
    const notifications = await this.notificationModel.find({
      houseId,
    });
    if (notifications.length > 0) {
      return notifications;
    }
    return null;
  }
}
