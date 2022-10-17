import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { catchError, map } from 'rxjs';
import { IndAppointmentsService } from 'src/ind-appointments/ind-appointments.service';
import { TimeCompareService } from 'src/time-compare/time-compare.service';
import { IndAmsterdamService } from './ind-amsterdam.service';

@Controller('ind-amsterdam')
export class IndAmsterdamController {
  constructor(
    private indAmsterdamService: IndAmsterdamService,
    private indAppointmentService: IndAppointmentsService,
    private timeCompareService: TimeCompareService,
  ) {}
  @Get('all')
  findAll() {
    return this.indAmsterdamService.findAll().pipe(
      map((response) => response.data),
      catchError(() => {
        throw new HttpException('something went wrong', 500);
      }),
    );
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Get()
  findSoonest() {
    return this.indAmsterdamService.findAll().pipe(
      map((response) => {
        const data = this.indAppointmentService.transformData(
          response.data as unknown as string,
        );
        if (data.status === 'OK') {
          console.log(
            'malek',
            this.indAppointmentService.getSoonestSlot(data.data),
          );

          return this.indAppointmentService.getSoonestSlot(data.data);
        } else {
          throw new HttpException('can not find any time', 500);
        }
      }),
    );
  }

  @Get('compare/:time?')
  findAppointmentCompareToTime(@Param() params) {
    return this.indAmsterdamService.findAll().pipe(
      map((response) => {
        const data = this.indAppointmentService.transformData(
          response.data as unknown as string,
        );
        if (data.status === 'OK') {
          try {
            const soonestSlots = data.data.filter(({ date }) =>
              this.timeCompareService.comapreTime(
                params?.time || '2022-10-26',
                date,
              ),
            );
            return soonestSlots;
          } catch (e) {
            console.log(e);
          }
        } else {
          throw new HttpException('can not find any time', 500);
        }
      }),
      catchError(() => {
        throw new HttpException('something went wrong', 500);
      }),
    );
  }
}
