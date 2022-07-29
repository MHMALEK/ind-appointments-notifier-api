import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IndAppointmentsService } from 'src/ind-appointments/ind-appointments.service';
import { TimeCompareService } from 'src/time-compare/time-compare.service';
import { IndAmsterdamController } from './ind-amsterdam.controller';
import { IndAmsterdamService } from './ind-amsterdam.service';

@Module({
  imports: [HttpModule],
  controllers: [IndAmsterdamController],
  providers: [IndAmsterdamService, IndAppointmentsService, TimeCompareService],
})
export class IndAmsterdamModule {}
