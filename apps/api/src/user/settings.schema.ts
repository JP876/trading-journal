import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class UserSettings {
  @Prop({ type: Object })
  tradesColumnVisibility?: any;
}

export type UserSettingsDocument = mongoose.HydratedDocument<UserSettings>;

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
