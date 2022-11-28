import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IndContentService {
  baseUrl = 'http://3.87.67.18:1337/api';
  token =
    'fb46b383dde6dca8f9cb4058c59705e8857c96fc0f0ccdcfd6c4024251872faf19a103d0a6225b0e19cdef1823c32000922ff10b4a058a37f71542f4598ea77841f08148646dcd2ff3399b9c93887dfd4e33dcab0f53a01164c6778a78417640d791cf1796645af8bf9de9b1a937531b33ed9b90271e6b80593315be34fc4c0f';
  constructor(private http: HttpService) {}
  async getIndContentFromCMS() {
    const res = await firstValueFrom(
      this.http.get(`${this.baseUrl}/service-desk`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }),
    );
    if (res) {
      const data = res.data.data.attributes;
      return {
        serviceTypes: data.service_types,
        desks: data.desks,
      };
    }
  }
}
