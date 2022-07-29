import { Injectable } from '@nestjs/common';
import Appointment from './interfaces/appointment.interface';

@Injectable()
export class IndAppointmentsService {
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
}
