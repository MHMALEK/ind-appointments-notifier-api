import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, map } from 'rxjs';
import Appointment from 'src/appointments/interfaces/appointment.interface';
import {
  defaultINDAPIPayload,
  QueryBuilderService,
} from 'src/query-builder/query-builder.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly httpService: HttpService,
    private queryBuilderService: QueryBuilderService,
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

  async requestAppointments(payload) {
    return this.generateHttpRequest(payload)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException('something went wrong', 500);
        }),
      )
      .toPromise();
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
}
