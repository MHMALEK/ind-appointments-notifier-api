import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ sparse: true, unique: false })
  email: string;
  @Prop({ unique: false })
  push: string | undefined | null;
  @Prop()
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
