import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import Appointment from 'src/ind-appointments/interfaces/appointment.interface';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class IndAmsterdamService {
  constructor(private readonly httpService: HttpService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  findAll(): Observable<
    AxiosResponse<{ status: number; data: Appointment[] }>
  > {
    return this.httpService.get(
      'https://oap.ind.nl/oap/api/desks/AM/slots/?productKey=DOC&persons=1',
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  cronaMa(): Observable<
    AxiosResponse<{ status: number; data: Appointment[] }>
  > {
    console.log('malek');
    return this.httpService
      .get(
        'https://oap.ind.nl/oap/api/desks/AM/slots/?productKey=DOC&persons=1',
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
      );
  }
}
