import { Body, Controller, Get, Post } from '@nestjs/common';
import { defaultINDAPIPayload } from 'src/query-builder/query-builder.service';
import { CreatNewNotifierForSpeceficUserTimeDTO } from './dto/CreatNewNotifierForSpeceficUserTime.dto';
import { NewAppointmentNotifierService } from './new-appointment-notifier.service';

@Controller('new-appointment-notifier')
export class NewAppointmentNotifierController {
  constructor(
    private newAppointmentNotifierService: NewAppointmentNotifierService,
  ) {}
  @Post('/')
  CreatNewNotifierForRequestedTime(
    @Body() body: CreatNewNotifierForSpeceficUserTimeDTO,
  ) {
    const {
      telegramId,
      date,
      service,
      desk,
      numberOfPeople = defaultINDAPIPayload.numberOfPeople,
    } = body;
    this.newAppointmentNotifierService.saveNewNotifierRequestFromUserSelectedTimeAndService(
      {
        telegramId,
        date,
        service,
        desk,
        numberOfPeople,
      },
    );
  }

  @Get('/')
  test() {
    this.newAppointmentNotifierService.cronJobUpdateAppointmentsDatabase();
  }
}
