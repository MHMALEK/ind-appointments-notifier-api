import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NotifierAppoinment,
  NotifierAppoinmentDocument,
} from 'src/new-appointment-notifier/schemas/appointmentNotifier.schema';
import { Time, TimeDocument } from 'src/user/schemas/time.schema';

@Injectable()
export class TimesService {
  constructor(
    @InjectModel(Time.name)
    private timeModel: Model<TimeDocument>,
    @InjectModel(NotifierAppoinment.name)
    private notifyAppointmentModel: Model<NotifierAppoinmentDocument>,
  ) {}
  async findAndRemoveOutDatedRequest() {
    return this.timeModel
      .find({
        date: { $lte: this.formatDate(new Date()) },
      })
      .remove();
  }
  async removeOutDatedRequests(data) {
    data.remove();
  }

  async findUsersThatRequestedTimeIsSoonerThanLatestAvailabelTime(
    soonestAvailableTime,
  ) {
    const result = await this.notifyAppointmentModel.find({
      service: { $in: soonestAvailableTime.service },
      date: { $gte: soonestAvailableTime.date },
    });

    if (result.length > 0) {
      await this.timeModel
        .find({
          date: { $gte: soonestAvailableTime.date },
        })
        .remove();
    }

    return result;
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
}
