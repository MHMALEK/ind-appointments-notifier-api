import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeCompareService {
  comapreTime(requestedTime: string, recivedSlotTime: string) {
    const formatedRequestedTime = new Date(requestedTime);
    const formatedSlotTime = new Date(recivedSlotTime);

    return formatedRequestedTime >= formatedSlotTime;
  }
}
