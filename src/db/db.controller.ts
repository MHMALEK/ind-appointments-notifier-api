import { Controller, Get } from '@nestjs/common';
import { DbService } from './db.service';

@Controller('db')
export class DbController {
  constructor(private dbServices: DbService) {}
  @Get()
  async test() {
    // return await this.dbServices.getFromDataBase();
  }
}
