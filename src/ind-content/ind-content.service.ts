import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const contentful = require('contentful');

@Injectable()
export class IndContentService {
  client: any;
  constructor(private configService: ConfigService) {
    console.log('asd');
    this.client = contentful.createClient({
      space: this.configService.get<string>('IND_CONTENT_API_SPACE'),
      accessToken: this.configService.get<string>('IND_CONTENT_API_TOKEN'),
    });
  }
  async getIndContentFromCMS() {
    try {
      const res = await this.client.getEntry('4XKP5Yd9oV0devAyvEopZl');
      return (res.fields as any).indData.data;
    } catch (e) {
      console.log(e);
    }
  }
}
