import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CollectResidencyPermitDenHaagDeskDocument =
  HydratedDocument<CollectResidencyPermitDenHaagDesk>;

@Schema()
export class CollectResidencyPermitDenHaagDesk {
  @Prop({ unique: true, required: true })
  key: string;
  @Prop({ unique: true, required: true })
  date: string;
  @Prop()
  startTime: string;
  @Prop()
  endTime: string;
  @Prop()
  parts: number;
}

export const CollectResidencyPermitDenHaagDeskSchema =
  SchemaFactory.createForClass(CollectResidencyPermitDenHaagDesk);
