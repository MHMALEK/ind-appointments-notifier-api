import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppointmentsService } from 'src/appointments/appointments.service';
import { IndContentService } from 'src/ind-content/ind-content.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { TimesService } from 'src/times/times.service';
import IND_DESKS from 'src/types/ind-desks';
import IND_SERVICES from 'src/types/ind-services';
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
    private userService: UserService,
    private indContentService: IndContentService,
  ) {}
  async cronJobUpdateAppointmentsDatabase() {
    const { serviceTypes } =
      await this.indContentService.getIndContentFromCMS();
    console.log('serviceTypes', serviceTypes);
    serviceTypes.map(async ({ desks, service_code }) => {
      desks.map(async (desk) => {
        const soonestAvailableTime = await this.appointmentService.findSoonest({
          desk: desk.code,
          service: service_code,
          numberOfPeople: '1',
        });

        if (soonestAvailableTime) {
          const users = await this.notifierAppoinmentModel.find({
            service: service_code,
            desk: desk.code,
            date: { $gte: soonestAvailableTime.date },
          });

          if (users.length > 0) {
            users.map((user) => {
              const notificationPayload = {
                date: soonestAvailableTime.date,
                telegramId: user.telegramId,
                service: user.service,
              };
              this.handleNotification(notificationPayload);
            });
          }
        }

        return soonestAvailableTime;
      });
    });
  }
  async saveNewNotifierRequestFromUserSelectedTimeAndService(
    payload: CreatNewNotifierForSpeceficUserTimeDTO,
  ) {
    const { telegramId, service } = payload;
    const isUserExist = await this.userService.isUserExist(telegramId);

    if (!isUserExist) {
      throw new HttpException('user does not exist', 404);
    }
    const alreadyRequestedTime = await this.notifierAppoinmentModel.findOne({
      telegramId,
      service,
    });

    if (alreadyRequestedTime) {
      return await this.notifierAppoinmentModel.updateOne(
        { telegramId },
        { payload },
      );
    }
    const dataToSave = new this.notifierAppoinmentModel(payload);

    await dataToSave
      .save()
      .then((item) => item)
      .catch((e) => new HttpException(e, 500));
  }

  async handleNotification(payload) {
    this.messengerService.sendMessageToUser(payload);
  }
}
