import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true, index: true, sparse: true })
  email: string;
  @Prop({ unique: true, index: true, sparse: true })
  pushToken: string | undefined | null;
  @Prop({ unique: true, index: true, sparse: true })
  firebase_user_id: string;
  @Prop({ unique: true, index: true, sparse: true })
  telegram_chat_id: string;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
