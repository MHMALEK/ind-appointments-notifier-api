import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DbService } from './db.service';
import { DbController } from './db.controller';
import {
  CollectResidencyPermitDenBoschDesk,
  CollectResidencyPermitDenBoschDeskSchema,
} from 'src/appointments/schemas/collectResidencyPermit.db.schema';
import {
  CollectResidencyPermitAmsterdamDesk,
  CollectResidencyPermitAmsterdamDeskSchema,
} from 'src/appointments/schemas/collectResidencyPermit.am.schema';
import {
  CollectResidencyPermitDenHaagDesk,
  CollectResidencyPermitDenHaagDeskSchema,
} from 'src/appointments/schemas/collectResidencyPermit.dh.schema';
import {
  CollectResidencyPermitZwolleDesk,
  CollectResidencyPermitZwolleDeskSchema,
} from 'src/appointments/schemas/collectResidencyPermit.zw.schema';

@Module({
  providers: [DbService],
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectResidencyPermitAmsterdamDesk.name,
        schema: CollectResidencyPermitAmsterdamDeskSchema,
      },
      {
        name: CollectResidencyPermitDenBoschDesk.name,
        schema: CollectResidencyPermitDenBoschDeskSchema,
      },
      {
        name: CollectResidencyPermitDenHaagDesk.name,
        schema: CollectResidencyPermitDenHaagDeskSchema,
      },
      {
        name: CollectResidencyPermitZwolleDesk.name,
        schema: CollectResidencyPermitZwolleDeskSchema,
      },
    ]),
  ],
  controllers: [DbController],
  exports: [
    MongooseModule.forFeature([
      {
        name: CollectResidencyPermitAmsterdamDesk.name,
        schema: CollectResidencyPermitAmsterdamDeskSchema,
      },
      {
        name: CollectResidencyPermitDenBoschDesk.name,
        schema: CollectResidencyPermitAmsterdamDeskSchema,
      },
      {
        name: CollectResidencyPermitDenHaagDesk.name,
        schema: CollectResidencyPermitDenHaagDeskSchema,
      },
      {
        name: CollectResidencyPermitZwolleDesk.name,
        schema: CollectResidencyPermitZwolleDeskSchema,
      },
    ]),
    DbService,
  ],
})
export class DbModule {}
