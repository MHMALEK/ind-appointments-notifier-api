import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Time, TimeDocument } from './schemas/time.schema';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Time.name)
    private timeModel: Model<TimeDocument>,
  ) {}
  async saveUserToDatabase(data) {
    const createdData = new this.userModel(data);
    return await createdData
      .save()
      .then((item) => item)
      .catch(() => new HttpException('error save in DB', 500));
  }
  public async isUserExist(telegramId) {
    return await this.userModel.findOne({ telegramId });
  }
  async saveUserLatestTime({ telegramId, date }) {
    // const createdData = new this.timeModel();
    const isUserExist = await this.isUserExist(telegramId);

    if (!isUserExist) {
      throw new HttpException('user does not exist', 404);
    }

    const alreadyRequestedTime = await this.timeModel.findOne({ telegramId });

    if (alreadyRequestedTime) {
      return await this.timeModel.updateOne({ telegramId }, { date });
    }

    const dataToSave = new this.timeModel({ telegramId, date });

    await dataToSave
      .save()
      .then((item) => item)
      .catch((e) => new HttpException(e, 500));
  }
}
