import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class ExchangeRates extends mongoose.Document {
  @Prop({ type: Number, required: true })
  timestamp: number;

  @Prop({ type: String, required: true })
  base: string;

  @Prop({ type: Object, required: true })
  rates: { [key: string]: number };

  @Prop({ type: Boolean, required: true, default: false })
  latest: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type ExchangeRatesDocument = mongoose.HydratedDocument<ExchangeRates>;

const ExchangeRatesSchema = SchemaFactory.createForClass(ExchangeRates);
export { ExchangeRatesSchema };
