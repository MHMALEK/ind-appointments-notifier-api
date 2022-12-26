import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { format } from 'date-fns';

import { AppointmentsService } from 'src/appointments/appointments.service';
import { IndContentService } from 'src/ind-content/ind-content.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { defaultINDAPIPayload } from 'src/query-builder/query-builder.service';
import { CreatNewNotifierForSpeceficUserTimeDTO } from './dto/CreatNewNotifierForSpeceficUserTime.dto';
import {
  NotifierAppoinment,
  NotifierAppoinmentDocument,
} from './schemas/appointmentNotifier.schema';

@Injectable()
export class NewAppointmentNotifierService {
  constructor(
    private appointmentService: AppointmentsService,
    private messengerService: MessengerService,
    @InjectModel(NotifierAppoinment.name)
    private notifierAppoinmentModel: Model<NotifierAppoinmentDocument>,
    private indContentService: IndContentService,
  ) {}

  async findUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot() {
    const { servicesByDesks } =
      await this.indContentService.getIndContentFromCMS();
    const data = Object.values(servicesByDesks).map(
      async ({ desks, code }: any) => {
        desks.map(async (desk) => {
          const soonestAvailableTime =
            await this.appointmentService.findSoonest({
              desk: desk.code,
              service: code,
              numberOfPeople: defaultINDAPIPayload.numberOfPeople,
            });
          if (soonestAvailableTime) {
            const users = await this.notifierAppoinmentModel.find({
              service: code,
              desk: desk.code,
              date: { $gte: soonestAvailableTime.date },
            });

            if (users.length > 0) {
              this.sendNotificationToUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot(
                users,
                soonestAvailableTime,
              );
            }
          }
        });
      },
    );
    return data;
  }

  async updateDataBaseAndRemoveOutdatedRequests() {
    const today = format(new Date(), 'dd-MM-yyy');

    const users = await this.notifierAppoinmentModel.find({
      date: { $lte: today },
    });

    if (users.length > 0) {
      users.map((user) => {
        const notificationPayload = {
          date: user.date,
          telegramId: user.telegramId,
          service: user.service,
        };
        console.log('notificationPayload', notificationPayload);
        this.handleNotificationForExpiredRequest(notificationPayload);
        this.removeExpiredRequestsFromDB();
      });
    }
  }

  async removeExpiredRequestsFromDB() {
    const today = format(new Date(), 'dd-MM-yyy');
    await this.notifierAppoinmentModel.remove({ date: { $lte: today } });
  }

  sendNotificationToUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot(
    users,
    soonestAvailableTime,
  ) {
    users.map((user) => {
      const notificationPayload = {
        date: soonestAvailableTime.date,
        telegramId: user.telegramId,
        service: user.service,
      };
      this.handleNotification(notificationPayload);
    });
  }

  async saveNewNotifierRequestFromUserSelectedTimeAndService(
    payload: CreatNewNotifierForSpeceficUserTimeDTO,
  ) {
    const { telegramId } = payload;
    console.log('telegramId', telegramId);

    const alreadyRequestedTime = await this.notifierAppoinmentModel.findOne({
      telegramId,
    });

    if (alreadyRequestedTime) {
      const res = await this.notifierAppoinmentModel.updateOne(
        { telegramId },
        { ...payload },
      );
      return await this.notifierAppoinmentModel.findOne({
        telegramId,
      });
    }
    const dataToSave = new this.notifierAppoinmentModel(payload);

    await dataToSave
      .save()
      .then((item) => {
        console.log('item', item);
        return item;
      })
      .catch((e) => {
        console.log('saddasdasd', e);
        new HttpException(e, 500);
      });
  }

  async handleNotification(payload) {
    this.messengerService.sendMessageToUser(payload);
  }

  async handleNotificationForExpiredRequest(payload) {
    this.messengerService.sendExpiredRequestMessageToUser(payload);
  }

  async sendTestMessage() {
    this.messengerService.sendMessageToUser({
      date: 'date',
      telegramId: 1949747267,
      service: 'doc',
    });
  }
}
