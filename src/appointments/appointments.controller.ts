import { Controller, Get, Query } from '@nestjs/common';
import { defaultINDAPIPayload } from 'src/query-builder/query-builder.service';
import { AppointmentsService } from './appointments.service';
import { GetSoonestAppointmentDTO } from './DTO/getSoonestAppointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentService: AppointmentsService) {}
  @Get('all')
  getAllAppointments() {
    return this.appointmentService.findAll(defaultINDAPIPayload);
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
