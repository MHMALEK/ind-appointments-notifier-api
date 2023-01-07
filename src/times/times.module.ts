import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Time, TimeSchema } from 'src/user/schemas/time.schema';
import { TimesService } from './times.service';

@Module({
  providers: [TimesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Time.name,
        schema: TimeSchema,
      },
    ]),
  ],
  exports: [
    TimesService,
    MongooseModule.forFeature([
      {
        name: Time.name,
        schema: TimeSchema,
      },
    ]),
  ],
})
export class TimesModule {}
