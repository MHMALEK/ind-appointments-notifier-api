import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TimeCompareService } from 'src/time-compare/time-compare.service';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { QueryBuilderService } from 'src/query-builder/query-builder.service';
import { DbService } from 'src/db/db.service';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [
    AppointmentsService,
    TimeCompareService,
    QueryBuilderService,
    DbService,
  ],
  imports: [HttpModule, DbModule],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
