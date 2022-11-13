import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TimeCompareService } from 'src/time-compare/time-compare.service';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { QueryBuilderService } from 'src/query-builder/query-builder.service';
import { DbService } from 'src/db/db.service';
import { DbModule } from 'src/db/db.module';
import { TimesModule } from 'src/times/times.module';
import { TimesService } from 'src/times/times.service';
import { CronjobsModule } from 'src/cronjobs/cronjobs.module';
import { CronjobsService } from 'src/cronjobs/cronjobs.service';

@Module({
  providers: [
    AppointmentsService,
    TimeCompareService,
    QueryBuilderService,
    DbService,
    TimesService,
    CronjobsService,
  ],
  imports: [HttpModule, DbModule, TimesModule],
  controllers: [AppointmentsController],
  exports: [
    AppointmentsService,
    TimeCompareService,
    QueryBuilderService,
    DbService,
    HttpModule,
  ],
})
export class AppointmentsModule {}
