import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';

import { AppointmentsService } from 'src/appointments/appointments.service';
import { IndContentService } from 'src/ind-content/ind-content.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { defaultINDAPIPayload } from 'src/query-builder/query-builder.service';
import { UserService } from 'src/user/user.service';
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
    const { telegramId, service } = payload;
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
}
