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
import IND_DESKS from 'src/types/ind-desks';

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
  async saveToDataBase(dbName, data) {
    const dbCollectionModel = this.mapDBNameToCollection(dbName);
    const createdAppointment = new dbCollectionModel(data);
    return createdAppointment
      .save()
      .then((item) => item)
      .catch(() => new HttpException('error save in DB', 500));
  }

  async saveUniqueDataToDataBase(dbName, data) {
    const dbCollectionModel = this.mapDBNameToCollection(dbName);

    const currentDataInDB = await this.getFromDataBase(dbName, {
      key: data.key,
    });
    if (currentDataInDB) {
      console.log('item exist');
      return;
    }
    const createdAppointment = new dbCollectionModel(data);
    return createdAppointment
      .save()
      .then((item) => item)
      .catch(() => new HttpException('error save in DB', 500));
  }

  async getFromDataBase(dbName, payload) {
    const dbCollectionModel = this.mapDBNameToCollection(dbName);

    return await dbCollectionModel.findOne({ ...payload });
  }

  async updateItemInDataBase(dbName, item) {
    const dbCollectionModel = this.mapDBNameToCollection(dbName);

    return await dbCollectionModel.findOneAndUpdate(
      { ...item },
      { ...item },
      { upsert: true },
    );
  }
  async clearCollection(dbName) {
    const dbCollectionModel = this.mapDBNameToCollection(dbName);
    return await dbCollectionModel.deleteMany({});
  }
  async saveOnlyOneItemInCollection(dbName, item) {
    await this.clearCollection(dbName);
    return await this.saveToDataBase(dbName, item);
  }

  private mapDBNameToCollection(dbName: IND_DESKS) {
    switch (dbName) {
      case IND_DESKS.AMSTERDAM:
        return this.amsterdamAppointmentModel;
      case IND_DESKS.DEN_BOSCH:
        return this.denBoschAppointmentModel;
      case IND_DESKS.ZWOLLE:
        return this.zwolleAppointmentModel;
      case IND_DESKS.DEN_HAAG:
        return this.denHaagAppointmentModel;
      default:
        return this.amsterdamAppointmentModel;
    }
  }
}
