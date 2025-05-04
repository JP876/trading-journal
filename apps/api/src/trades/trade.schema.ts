import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

import { tradeDirection, tradeResult } from './enums';
import { Account } from 'src/accounts/account.schema';

@Schema()
class TradeFiles {
  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  name: string;
}

const TradeFilesSchema = SchemaFactory.createForClass(TradeFiles);

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class Trade extends mongoose.Document {
  @Prop({ type: Date, isRequired: false })
  openDate?: Date;

  @Prop({ type: Date, isRequired: false })
  closeDate?: Date;

  @Prop({ type: String, isRequired: true })
  pair: string;

  @Prop({ type: String, isRequired: true, enum: tradeResult })
  result: tradeResult;

  @Prop({ type: mongoose.Types.Decimal128, isRequired: true })
  stopLoss: number;

  @Prop({ type: mongoose.Types.Decimal128, isRequired: true })
  takeProfit: number;

  riskReward: string;

  @Prop({ type: String, isRequired: true, enum: tradeDirection })
  direction: tradeDirection;

  @Prop({ type: mongoose.Types.Decimal128 })
  pl?: number;

  @Prop({ type: String, isRequired: false })
  comment?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Account.name, required: true })
  @Type(() => Account)
  account: mongoose.Types.ObjectId;

  @Prop([TradeFilesSchema])
  files?: TradeFiles[];
}

export type TradeDocument = mongoose.HydratedDocument<Trade>;

const TradeSchema = SchemaFactory.createForClass(Trade);

TradeSchema.virtual('riskReward').get(function () {
  return this.takeProfit / this.stopLoss;
});

export { TradeSchema };
