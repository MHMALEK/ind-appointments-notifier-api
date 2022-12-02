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
  async CreatNewNotifierForRequestedTime(
    @Body() body: CreatNewNotifierForSpeceficUserTimeDTO,
  ) {
    const {
      telegramId,
      date,
      service,
      desk,
      numberOfPeople = defaultINDAPIPayload.numberOfPeople,
    } = body;

    console.log('bodybodybodybodybody', body);
    const res =
      await this.newAppointmentNotifierService.saveNewNotifierRequestFromUserSelectedTimeAndService(
        {
          telegramId,
          date,
          service,
          desk,
          numberOfPeople,
        },
      );
    return res;
  }

  @Get('/')
  async findUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot() {
    const res =
      await this.newAppointmentNotifierService.findUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot();
    return 'succes';
  }
}
