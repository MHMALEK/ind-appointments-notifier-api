import { Controller, Get } from '@nestjs/common';
import { defaultINDAPIPayload } from 'src/query-builder/query-builder.service';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentService: AppointmentsService) {}
  @Get('all')
  getAllAppointments() {
    return this.appointmentService.findAll(defaultINDAPIPayload);
  }

  @Get('soonest')
  getSoonestAppointments() {
    return this.appointmentService.findSoonest(defaultINDAPIPayload);
  }

  @Get('test')
  async test() {
    return await this.appointmentService.findSoonestAndSaveToDataBase();
  }
}
