import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { IndContentService } from 'src/ind-content/ind-content.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { defaultINDAPIPayload } from 'src/query-builder/query-builder.service';
import { IND_DESKS_LABELS } from 'src/types/ind-desks';
import { IND_SERVICES_LABELS } from 'src/types/ind-services';
import { UserService } from 'src/user/user.service';
import { CreateNotificationDto } from './notification.dto';
import { Notification, NotificationDocument } from './notification.schema';
import * as dayjs from 'dayjs';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private userService: UserService,
    private appointmentService: AppointmentsService,
    private indContentService: IndContentService,
    private messengerService: MessengerService,
  ) {}

  convertDateToTimeStamp(date: string) {
    const dateArray = date.split('-');
    console.log('12132312', dateArray, date);
    return dayjs(date).unix();
  }

  convertTimeStampToDate(timestamp: number) {
    const dateObject = dayjs.unix(timestamp);
    return dayjs(dateObject).format('DD-MM-YYYY');
  }

  async createNewnotification(createNotificationDto: CreateNotificationDto) {
    const user = await this.findUserWhoCreateNotification(
      createNotificationDto,
    );

    if (user) {
      if (!user.isVerified) {
        // send verification
        return 'user is not verifed yet';
      } else {
        try {
          await this.userService.updateUser(createNotificationDto);

          const notificationExistAlready = await this.findnotificationsForUser({
            userId: user.id,
            desk: createNotificationDto.desk,
            service: createNotificationDto.service,
            date: this.convertDateToTimeStamp(createNotificationDto.date),
          });

          if (notificationExistAlready) {
            const updatedNotification = await this.updateNotification({
              userId: user.id,
              desk: createNotificationDto.desk,
              service: createNotificationDto.service,
              date: this.convertDateToTimeStamp(createNotificationDto.date),
            });
            return updatedNotification;
          } else {
            try {
              const creatednotification = new this.notificationModel({
                userId: user.id,
                desk: createNotificationDto.desk,
                service: createNotificationDto.service,
                date: this.convertDateToTimeStamp(createNotificationDto.date),
              });
              const createdNotificationRes = await creatednotification.save();
              return createdNotificationRes;
            } catch (e) {
              throw new Error('something went wrong');
            }
          }
        } catch (e) {
          console.log('e', e);
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
          date: this.convertDateToTimeStamp(createNotificationDto.date),
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

  findNotificationThatIsSoonerThanThisDate = async ({
    date,
    service,
    desk,
  }) => {
    const timeStapDate = this.convertDateToTimeStamp(date);
    console.log('timeStapDate', timeStapDate);
    const notifications = await this.notificationModel.find({
      service,
      desk,
      date: { $gte: timeStapDate },
    });
    return notifications;
  };

  async findUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot() {
    const { servicesByDesks } =
      await this.indContentService.getIndContentFromCMS();
    const servicesByDesksArray = Object.values(servicesByDesks) as any;
    for (let b = 0; b < servicesByDesksArray.length; b++) {
      const { desks, code } = servicesByDesksArray[b];
      for (let i = 0; i < desks.length; i++) {
        const soonestAvailableTime = await this.appointmentService.findSoonest({
          desk: desks[i].code,
          service: code,
          numberOfPeople: defaultINDAPIPayload.numberOfPeople,
        });
        if (soonestAvailableTime) {
          const notifications =
            await this.findNotificationThatIsSoonerThanThisDate({
              service: code,
              desk: desks[i].code,
              date: soonestAvailableTime.date,
            });

          if (notifications.length > 0) {
            this.handleGetUserInfoForSendNotificationToUsers(
              notifications,
              soonestAvailableTime,
            );
          }
        }
      }
    }
  }

  getServiceLabelByServiceCode = (serviceCode: string) =>
    IND_SERVICES_LABELS[serviceCode];
  getDeskLabelByDeskCode = (deskCode: string) => IND_DESKS_LABELS[deskCode];

  getToday = () => dayjs().unix();

  generatePushNotificationMessage = (notification, soonestAvailableTime) => {
    return `Hello! You have requested a slot sooner than ${this.convertTimeStampToDate(
      notification.date,
    )} for ${this.getServiceLabelByServiceCode(
      notification.service,
    )} at ${this.getDeskLabelByDeskCode(notification.desk)}.
     We have found a new slot available at ${soonestAvailableTime.date} from ${
      soonestAvailableTime.startTime
    } to ${soonestAvailableTime.endTime}. <a href="">Get it now!</a>
     `;
  };
  handleGetUserInfoForSendNotificationToUsers = async (
    notifications: any,
    soonestAvailableTime: any,
  ) => {
    for (let i = 0; i < notifications.length; i++) {
      const user = await this.userService.findUserById(notifications[i].userId);
      const message = this.generatePushNotificationMessage(
        notifications[i],
        soonestAvailableTime,
      );
      this.handleSendPushNotificationToUser(user, message);
    }

    return notifications;
  };

  handleSendPushNotificationToUser = async (user, message) => {
    console.log(111, user, message);
    this.messengerService.sendMessageToUser(user, message);
  };

  generateExpiredRequestPushNotificationMessage = (notification) => {
    return `Hello!
     You have requested a slot sooner than  ${this.convertTimeStampToDate(
       notification.date,
     )} for ${this.getServiceLabelByServiceCode(
      notification.service,
    )} at ${this.getDeskLabelByDeskCode(notification.desk)}.
     We could not find any slot sooner than your requested time and this request is not valid anymore. if you need an appointment, please create a new request.
     `;
  };

  updateDataBaseAndRemoveOutdatedRequests = async () => {
    const todayTimestamp = this.getToday();
    const notifications = await this.notificationModel.find({
      date: { $lte: todayTimestamp },
    });
    for (let i = 0; i < notifications.length; i++) {
      const user = await this.userService.findUserById(notifications[i].userId);
      const message = this.generateExpiredRequestPushNotificationMessage(
        notifications[i],
      );
      await this.handleSendPushNotificationToUser(user, message);
      await notifications[i].remove();
    }

    return notifications;
  };
}
