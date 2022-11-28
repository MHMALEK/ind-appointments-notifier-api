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
    console.log('asda', this.queryBuilderService.generateQuery(payload));
    return this.httpService.get(
      this.queryBuilderService.generateQuery(payload),
    );
  }

  async requestAppointments(payload) {
    return firstValueFrom(this.generateHttpRequest(payload)).then(
      (response) => response.data,
      catchError(() => {
        throw new HttpException('something went wrong', 500);
      }),
    );
  }

  async findAll(payload) {
    const response = await this.requestAppointments(payload);

    if (response) {
      const data = this.transformData(response as unknown as string);
      if (data.status === 'OK') {
        return data.data;
      } else {
        throw new HttpException('can not find any time', 500);
      }
    }
  }

  async findSoonest(payload) {
    const response = await this.requestAppointments(payload);

    if (response) {
      const data = this.transformData(response as unknown as string);
      if (data.status === 'OK') {
        return this.getSoonestSlot(data.data);
      } else {
        throw new HttpException('can not find any time', 500);
      }
    }
  }

  async findAppointmentCompareToTime(payload, params) {
    try {
      const response = await this.requestAppointments(payload);

      if (response) {
        const data = this.transformData(response.data as unknown as string);
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
      }
    } catch (e) {
      throw new HttpException('can not find any time', 500);
    }
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
