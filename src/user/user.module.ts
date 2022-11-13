import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { DbService } from 'src/db/db.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Time, TimeSchema } from './schemas/time.schema';
import { TimesService } from 'src/times/times.service';

@Module({
  providers: [UserService, DbService, TimesService],
  imports: [
    DbModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Time.name,
        schema: TimeSchema,
      },
    ]),
  ],
  controllers: [UserController],
})
export class UserModule {}
