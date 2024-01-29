import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getFirstText(): string {
    return 'Ind appointments API!';
  }
}
