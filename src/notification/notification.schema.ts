import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  service: string;

  @Prop({ required: true })
  desk: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
