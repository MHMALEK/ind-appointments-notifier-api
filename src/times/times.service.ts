import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Time, TimeDocument } from 'src/user/schemas/time.schema';

@Injectable()
export class TimesService {
  constructor(
    @InjectModel(Time.name)
    private timeModel: Model<TimeDocument>,
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
