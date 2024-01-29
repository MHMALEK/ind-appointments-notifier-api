import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ sparse: true, unique: true })
  email: string;
  @Prop({ unique: false })
  pushToken: string | undefined | null;
  @Prop({ unique: true })
  firebase_user_id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
