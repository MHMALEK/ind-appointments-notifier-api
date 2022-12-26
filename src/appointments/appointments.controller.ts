import { Controller, Get, Query } from '@nestjs/common';
import { CronjobsService } from 'src/cronjobs/cronjobs.service';
import { defaultINDAPIPayload } from 'src/query-builder/query-builder.service';
import { AppointmentsService } from './appointments.service';
import { GetSoonestAppointmentDTO } from './DTO/getSoonestAppointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private appointmentService: AppointmentsService, // private cronjobsService: CronjobsService,
  ) {}
  @Get('all')
  getAllAppointments() {
    return this.appointmentService.findAll(defaultINDAPIPayload);
  }

  @Get('soonest-test')
  getSoonestAppointmentsTest() {
    return this.appointmentService.findSoonest(defaultINDAPIPayload);
  }

  @Get('test')
  async test() {
    // return await this.cronjobsService.cronJobUpdateAppointmentsDatabase();
  }

  @Get('soonest')
  getSoonestAppointments(
    @Query() getSoonestAppointmentsDto: GetSoonestAppointmentDTO,
  ) {
    const {
      service,
      desk,
      numberOfPeople = defaultINDAPIPayload.numberOfPeople,
    } = getSoonestAppointmentsDto;

    return this.appointmentService.findSoonest({
      service,
      desk,
      numberOfPeople,
    });
  }
}
