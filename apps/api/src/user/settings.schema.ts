import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class UserSettings {
  @Prop({ type: Object })
  tradesColumnVisibility?: any;

  @Prop({ type: mongoose.Types.Decimal128 })
  defaultStopLoss?: any;

  @Prop({ type: mongoose.Types.Decimal128 })
  defaultTakeProfit?: any;
}

export type UserSettingsDocument = mongoose.HydratedDocument<UserSettings>;

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
