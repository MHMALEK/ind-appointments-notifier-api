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
import IND_DESKS from 'src/types/ind-desks';
import IND_SERVICES from 'src/types/ind-services';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly httpService: HttpService,
    private timeCompareService: TimeCompareService,
    private queryBuilderService: QueryBuilderService,
    private dataBaseService: DbService,
  ) {}

  private transformData(response: string) {
    try {
      const rawData = response.slice(5, response.length);
      return JSON.parse(rawData);
    } catch (e) {
      console.log(e);
    }
  }

  private getSoonestSlot(data: Appointment[]) {
    return data[0];
  }

  private generateHttpRequest(payload = defaultINDAPIPayload) {
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

  async saveToDB(dbName, data) {
    return await this.dataBaseService.saveOnlyOneItemInCollection(dbName, data);
  }

  async findSoonestAndSaveToDataBase(payload = defaultINDAPIPayload) {
    const soonestTime = await this.findSoonest(payload);
    const savedData = await this.saveToDB(payload.desk, soonestTime);
    return savedData;
  }
}
