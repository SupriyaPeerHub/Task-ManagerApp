// username, email, password, type
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from 'src/interfaces/user-role.enum';
import { Document } from 'mongoose';

export type UserDocument = User & Document; // <--- User comes from the class below
@Schema()
export class User {
  @Prop({ required: true })
  username!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  type!: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
