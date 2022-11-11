import { Injectable } from '@nestjs/common';
import IND_DESKS from 'src/types/ind-desks';
import IND_SERVICES from 'src/types/ind-services';
import IND_API_BASE_URL from './endpoints';

export const defaultINDAPIPayload = {
  service: IND_SERVICES.COLLECT_DOCUMENTS,
  desk: IND_DESKS.AMSTERDAM,
  numberOfPeople: 1,
};

@Injectable()
export class QueryBuilderService {
  private baseAPIUrl = IND_API_BASE_URL;

  generateQuery({ service, desk, numberOfPeople } = defaultINDAPIPayload) {
    return `${this.baseAPIUrl}/${desk}/slots/?productKey=${service}&persons=${numberOfPeople}`;
  }
}
