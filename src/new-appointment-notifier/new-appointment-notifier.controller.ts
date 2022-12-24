import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
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

    console.log(telegramId, date, service, desk);

    try {
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
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  @Get('/')
  async findUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot() {
    try {
      await this.newAppointmentNotifierService.findUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot();
      return 'succes';
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
