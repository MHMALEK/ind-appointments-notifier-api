import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, map } from 'rxjs';
import Appointment from 'src/appointments/interfaces/appointment.interface';
import { DbService } from 'src/db/db.service';
import {
  defaultINDAPIPayload,
  QueryBuilderService,
} from 'src/query-builder/query-builder.service';
import { TimeCompareService } from 'src/time-compare/time-compare.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly httpService: HttpService,
    private timeCompareService: TimeCompareService,
    private queryBuilderService: QueryBuilderService,
    private dataBaseService: DbService,
  ) {}

  transformData(response: string) {
    try {
      const rawData = response.slice(5, response.length);
      return JSON.parse(rawData);
    } catch (e) {
      console.log(e);
    }
  }

  getSoonestSlot(data: Appointment[]) {
    return data[0];
  }

  generateHttpRequest(payload = defaultINDAPIPayload) {
    return this.httpService.get(
      this.queryBuilderService.generateQuery(payload),
    );
  }

  requestAppointments(payload) {
    return this.generateHttpRequest(payload).pipe(
      map((response) => response.data),
      catchError(() => {
        throw new HttpException('something went wrong', 500);
      }),
    );
  }

  findAll(payload) {
    return firstValueFrom(this.requestAppointments(payload)).then(
      (response) => {
        const data = this.transformData(response as unknown as string);
        if (data.status === 'OK') {
          return data.data;
        } else {
          throw new HttpException('can not find any time', 500);
        }
      },
    );
  }

  findSoonest(payload) {
    return firstValueFrom(this.requestAppointments(payload)).then(
      (response) => {
        const data = this.transformData(response as unknown as string);
        if (data.status === 'OK') {
          return this.getSoonestSlot(data.data);
        } else {
          throw new HttpException('can not find any time', 500);
        }
      },
    );
  }

  findAppointmentCompareToTime(payload, params) {
    return firstValueFrom(this.requestAppointments(payload))
      .then((respnse) => {
        const data = this.transformData(respnse.data as unknown as string);
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
      })
      .catch((e) => {
        throw new HttpException('can not find any time', 500);
      });
  }

  async saveToDB(data) {
    return await this.dataBaseService.updateItemInDataBase(data);
  }

  async findSoonestAndSaveToDataBase() {
    const soonestTime = await this.findSoonest(defaultINDAPIPayload);
    const savedData = await this.saveToDB(soonestTime);
    return savedData;
  }
}
