import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CollectResidencyPermitDenBoschDeskDocument =
  HydratedDocument<CollectResidencyPermitDenBoschDesk>;

@Schema()
export class CollectResidencyPermitDenBoschDesk {
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

export const CollectResidencyPermitDenBoschDeskSchema =
  SchemaFactory.createForClass(CollectResidencyPermitDenBoschDesk);
