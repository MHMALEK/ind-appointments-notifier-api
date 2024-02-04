import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PreferedWayOfCommunication } from './notification.dto';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({ required: true })
  firebase_user_id: string;

  @Prop({ required: true })
  date: number;

  @Prop({ required: true })
  service: string;

  @Prop({ required: true })
  desk: string;

  @Prop({ required: true })
  prefered_way_of_communication: PreferedWayOfCommunication;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
