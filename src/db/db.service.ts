import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CollectResidencyPermitAmsterdamDesk,
  CollectResidencyPermitAmsterdamDeskDocument,
} from 'src/appointments/schemas/collectResidencyPermit.am.schema';
import {
  CollectResidencyPermitDenBoschDesk,
  CollectResidencyPermitDenBoschDeskDocument,
} from 'src/appointments/schemas/collectResidencyPermit.db.schema';
import {
  CollectResidencyPermitDenHaagDesk,
  CollectResidencyPermitDenHaagDeskDocument,
} from 'src/appointments/schemas/collectResidencyPermit.dh.schema';
import {
  CollectResidencyPermitZwolleDesk,
  CollectResidencyPermitZwolleDeskDocument,
} from 'src/appointments/schemas/collectResidencyPermit.zw.schema';

@Injectable()
export class DbService {
  constructor(
    @InjectModel(CollectResidencyPermitAmsterdamDesk.name)
    private amsterdamAppointmentModel: Model<CollectResidencyPermitAmsterdamDeskDocument>,
    @InjectModel(CollectResidencyPermitDenBoschDesk.name)
    private denBoschAppointmentModel: Model<CollectResidencyPermitDenBoschDeskDocument>,
    @InjectModel(CollectResidencyPermitZwolleDesk.name)
    private zwolleAppointmentModel: Model<CollectResidencyPermitZwolleDeskDocument>,
    @InjectModel(CollectResidencyPermitDenHaagDesk.name)
    private denHaagAppointmentModel: Model<CollectResidencyPermitDenHaagDeskDocument>,
  ) {}
  async saveToDataBase(data) {
    const createdAppointment = new this.amsterdamAppointmentModel(data);
    return createdAppointment
      .save()
      .then((item) => item)
      .catch(() => new HttpException('error save in DB', 500));
  }

  async saveUniqueDataToDataBase(data) {
    const currentDataInDB = await this.getFromDataBase({ key: data.key });
    if (currentDataInDB) {
      console.log('item exist');
      return;
    }
    const createdAppointment = new this.amsterdamAppointmentModel(data);
    return createdAppointment
      .save()
      .then((item) => item)
      .catch(() => new HttpException('error save in DB', 500));
  }

  async getFromDataBase(payload) {
    return await this.amsterdamAppointmentModel.findOne({ ...payload });
  }

  async updateItemInDataBase(item) {
    console.log('item', item);
    return await this.amsterdamAppointmentModel.findOneAndUpdate(
      { ...item },
      { ...item },
      { upsert: true },
    );
  }
}
