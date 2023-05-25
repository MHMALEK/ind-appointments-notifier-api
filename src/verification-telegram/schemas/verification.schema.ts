import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VerificationDocument = HydratedDocument<Verification>;

@Schema()
export class Verification {
  @Prop()
  code: string;
  @Prop()
  createdTime: string;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
