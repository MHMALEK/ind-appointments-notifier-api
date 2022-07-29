import { Module } from '@nestjs/common';
import { IndAppointmentsService } from './ind-appointments.service';

@Module({
  providers: [IndAppointmentsService],
})
export class IndAppointmentsModule {}
