import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import IND_DESKS from 'src/types/ind-desks';
import IND_SERVICES from 'src/types/ind-services';

export type NotifierAppoinmentDocument = HydratedDocument<NotifierAppoinment>;

@Schema()
export class NotifierAppoinment {
  @Prop()
  telegramId: string;
  @Prop()
  date: string;
  @Prop()
  service: IND_SERVICES;
  @Prop()
  desk: IND_DESKS;
  @Prop()
  numberOfPeople: string;
}

export const NotifierAppoinmentSchema =
  SchemaFactory.createForClass(NotifierAppoinment);
