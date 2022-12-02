import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IndContentService {
  baseUrl = 'http://localhost:3000';
  constructor(private http: HttpService) {}
  async getIndContentFromCMS() {
    const res: any = await firstValueFrom(
      this.http.get(`${this.baseUrl}/data`),
    );
    if (res) {
      return {
        serviceTypes: res.data.servicesByDesks,
        desks: res.data.desks,
      };
    }
  }
}
