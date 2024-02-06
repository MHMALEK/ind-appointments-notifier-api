import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { IndContentService } from 'src/ind-content/ind-content.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { defaultINDAPIPayload } from 'src/query-builder/query-builder.service';
import { IND_DESKS_LABELS } from 'src/types/ind-desks';
import { IND_SERVICES_LABELS } from 'src/types/ind-services';
import { UserService } from 'src/user/user.service';
import {
  CreateNotificationDto,
  PreferedWayOfCommunication,
} from './notification.dto';
import { Notification, NotificationDocument } from './notification.schema';
import * as dayjs from 'dayjs';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,

    // private userService: UserService,
    private appointmentService: AppointmentsService,
    private indContentService: IndContentService,
    private messengerService: MessengerService,
  ) {}

  convertDateToTimeStamp(date: string) {
    return dayjs(date).unix();
  }

  convertTimeStampToDate(timestamp: number) {
    const dateObject = dayjs.unix(timestamp);
    return dayjs(dateObject).format('DD-MM-YYYY');
  }

  async getAllNotificationsForUser({
    firebase_user,
    telegram_chat_id,
  }: {
    firebase_user?: any;
    telegram_chat_id?: string;
  }) {
    const user = await this.userService.findUserByFireBaseUserId({
      firebase_user_id: firebase_user?.user_id,
      telegram_chat_id,
    });
    if (!user) {
      throw new HttpException('user not found', 404);
    }
    const notifications = await this.notificationModel.find({
      firebase_user_id: user.firebase_user_id,
    });
    return notifications;
  }

  async findUserByNotificationId(notificationId: string) {
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) {
      throw new HttpException('notification not found', 404);
    }
    const user = await this.userService.findUserByFireBaseUserId({
      firebase_user_id: notification?.firebase_user_id,
      telegram_chat_id: notification?.telegram_chat_id,
    });
    if (!user) {
      throw new HttpException('user not found', 404);
    }
    return user;
  }

  async saveNotificationToDb(createNotificationDto: CreateNotificationDto) {
    const createdNotification = new this.notificationModel({
      ...createNotificationDto,
      date: this.convertDateToTimeStamp(createNotificationDto.date),
    });
    return createdNotification.save();
  }
  async createNewnotification(
    firebase_user,
    createNotificationDto: CreateNotificationDto,
  ) {
    try {
      const userWhoMadeNotification = await this.findUserWhoCreateNotification({
        firebase_user_id: firebase_user?.user_id,
      });

      if (!userWhoMadeNotification) {
        // first time user

        await this.userService.saveUserToDb({
          firebase_user_id: firebase_user.user_id,
          email: firebase_user.email,
          pushToken: firebase_user.pushToken,
          telegram_chat_id: undefined,
        });
      }

      const notificationExistAlready = await this.findNotificationForUser({
        firebase_user_id: firebase_user.user_id,
        desk: createNotificationDto.desk,
        service: createNotificationDto.service,
        date: this.convertDateToTimeStamp(createNotificationDto.date),
        prefered_way_of_communication:
          createNotificationDto.prefered_way_of_communication,
      });
      if (notificationExistAlready) {
        // if same notification exist already, return it
        return notificationExistAlready;
      } else {
        // if notification does not exist, create it
        await this.saveNotificationToDb({
          ...createNotificationDto,
          firebase_user_id: userWhoMadeNotification?.firebase_user_id,
        });
      }
    } catch (e) {
      console.log(e);
      throw new HttpException('something went wrong', 500);
    }
  }

  async findUserWhoCreateNotification(payload: {
    firebase_user_id?: string;
    telegram_chat_id?: string;
  }) {
    const user = await this.userService.findUserByFireBaseUserId(payload);
    if (!user) {
      return null;
    }
    return user;
  }
  async findNotificationForUser({
    firebase_user_id,
    service,
    date,
    desk,
    telegram_chat_id,
    prefered_way_of_communication,
  }: {
    firebase_user_id?: string;
    service;
    date;
    desk;
    telegram_chat_id?: string;
    prefered_way_of_communication;
  }) {
    const query = {
      service,
      date,
      desk,
      prefered_way_of_communication,
      $or: [],
    };

    if (firebase_user_id) {
      query.$or.push({ firebase_user_id });
    }
    if (telegram_chat_id) {
      query.$or.push({ telegram_chat_id });
    }

    const notification = await this.notificationModel.findOne(query);

    return notification;
  }
  findNotificationThatIsSoonerThanThisDate = async ({
    date,
    service,
    desk,
  }) => {
    const timeStapDate = this.convertDateToTimeStamp(date);
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

  generateNotificationMessage = (notification, soonestAvailableTime) => {
    if (
      notification.prefered_way_of_communication ===
      PreferedWayOfCommunication.PUSH_NOTIFICATION
    ) {
      return `Hooray! There is a new slot is available for ${this.getServiceLabelByServiceCode(
        notification.service,
      ).toLowerCase()} on this time: ${soonestAvailableTime.date}
    
      )}`;
    }

    if (
      notification.prefered_way_of_communication ===
      PreferedWayOfCommunication.TELEGRAM
    ) {
      return `
      Hello! You have requested a slot sooner than ${this.convertTimeStampToDate(
        notification.date as any,
      )} for ${this.getServiceLabelByServiceCode(
        notification.service,
      )} at ${this.getDeskLabelByDeskCode(notification.desk)}.
We have found a new slot available at ${soonestAvailableTime.date} from ${
        soonestAvailableTime.startTime
      } to ${
        soonestAvailableTime.endTime
      }. You can book it via <a href="https://oap.ind.nl/oap/en/#/${
        notification.service
      }">this link</a>. 
      
If you don't want to get any notification for this service, please /unsubscribe to cancel your request.
      `;
    }
    // for other type of notifications
    return `
      <p>Hello!</p>
      <p>You have requested a slot sooner than ${this.convertTimeStampToDate(
        notification.date as any,
      )} for ${this.getServiceLabelByServiceCode(
      notification.service,
    )} at ${this.getDeskLabelByDeskCode(notification.desk)}.</p>
      <p>We have found a new slot available at ${
        soonestAvailableTime.date
      } from ${soonestAvailableTime.startTime} to ${
      soonestAvailableTime.endTime
    }. <a href="https://oap.ind.nl/oap/en/#/${
      notification.service
    }">Book this one</a></p>
      <p>If you don't want to get any notification for this service, please <a href="${
        process.env.BASE_URL
      }/users/unsubscribe?notification_id=${
      notification.id
    }">click here</a> to cancel your request</p>.
    <p>If you don't want to get any notification from us and remove your data, please send <a href="${
      process.env.BASE_URL
    }/users/unsubscribe/all?notification_id=${
      notification.id
    }">Remove my data</a> request.</p>.

    `;
  };

  handleGetUserInfoForSendNotificationToUsers = async (
    notifications: any,
    soonestAvailableTime: any,
  ) => {
    for (let i = 0; i < notifications.length; i++) {
      const user = await this.userService.findUserByFireBaseUserId({
        firebase_user_id: notifications[i].firebase_user_id,
        telegram_chat_id: notifications[i].telegram_chat_id,
      });
      const message = this.generateNotificationMessage(
        notifications[i],
        soonestAvailableTime,
      );

      this.handleSendNotificationToUser(
        user,
        message,
        undefined,
        notifications[i].prefered_way_of_communication,
      );
    }
    return notifications;
  };

  handleSendNotificationToUser = async (
    user,
    message,
    title = 'New slot is available',
    prefered_way_of_communication,
  ) => {
    this.messengerService.sendMessageToUser(
      user,
      message,
      title,
      prefered_way_of_communication,
    );
  };

  generateExpiredRequestNotificationMessage = (notification) => {
    if (
      notification.prefered_way_of_communication ===
      PreferedWayOfCommunication.PUSH_NOTIFICATION
    ) {
      return 'Your request has been expired.';
    }
    return `<p>Hello!</p><p>You have requested a slot sooner than  ${this.convertTimeStampToDate(
      notification.date,
    )} for ${this.getServiceLabelByServiceCode(
      notification.service,
    )} at ${this.getDeskLabelByDeskCode(
      notification.desk,
    )}.</p><p>We could not find any slot sooner than your requested time and this request is not valid anymore. if you need an appointment, please create a new request.</p>
     `;
  };

  updateDataBaseAndRemoveOutdatedRequests = async () => {
    const todayTimestamp = this.getToday();
    const notifications = await this.notificationModel.find({
      date: { $lte: todayTimestamp },
    });
    for (let i = 0; i < notifications.length; i++) {
      const user = await this.userService.findUserByFireBaseUserId({
        firebase_user_id: notifications[i].firebase_user_id,
        telegram_chat_id: notifications[i].telegram_chat_id,
      });
      const message = this.generateExpiredRequestNotificationMessage(
        notifications[i],
      );
      // alwayt
      await this.handleSendNotificationToUser(
        user,
        message,
        undefined,
        notifications[i].prefered_way_of_communication,
      );
      await notifications[i].remove();
    }

    return notifications;
  };
  cancelNotification = async (notificationId: string) => {
    const notification = await this.notificationModel.findByIdAndRemove(
      notificationId,
    );
    if (notification) {
      return true;
    }
    return new HttpException('something went wrong', 500);
  };
  async deleteAllNotificationsForUser(firebase_user_id) {
    return await this.notificationModel.deleteMany({ firebase_user_id });
  }
  async deleteOneNotificationForUser(notificationId) {
    return await this.notificationModel.findOneAndDelete({
      _id: notificationId,
    });
  }

  async createNewTelegramNotification(telegram_chat_id, service, desk, date) {
    try {
      const userWhoMadeNotification = await this.findUserWhoCreateNotification({
        telegram_chat_id: telegram_chat_id,
      });

      if (!userWhoMadeNotification) {
        // first time user

        await this.userService.saveUserToDb({
          telegram_chat_id,
        });
      }

      const notificationExistAlready = await this.findNotificationForUser({
        desk,
        service,
        date: this.convertDateToTimeStamp(date),
        prefered_way_of_communication: PreferedWayOfCommunication.TELEGRAM,
        telegram_chat_id,
      });

      if (notificationExistAlready) {
        // if same notification exist already, return it
        return notificationExistAlready;
      } else {
        // if notification does not exist, create it
        await this.saveNotificationToDb({
          desk,
          service,
          date,
          telegram_chat_id,
          prefered_way_of_communication: PreferedWayOfCommunication.TELEGRAM,
          firebase_user_id: undefined,
        });
      }
    } catch (e) {
      console.log(e);
      throw new HttpException('something went wrong', 500);
    }
  }
}
