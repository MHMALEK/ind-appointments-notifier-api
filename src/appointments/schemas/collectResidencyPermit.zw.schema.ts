import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CollectResidencyPermitZwolleDeskDocument =
  HydratedDocument<CollectResidencyPermitZwolleDesk>;

@Schema()
export class CollectResidencyPermitZwolleDesk {
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

export const CollectResidencyPermitZwolleDeskSchema =
  SchemaFactory.createForClass(CollectResidencyPermitZwolleDesk);
