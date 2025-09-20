import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

import { closedBy, orderType, tradeDirection, tradeResult } from './enums';
import { Account } from 'src/accounts/account.schema';
import { Upload, UploadSchema } from 'src/uploads/uploads.schema';
import { Tag } from 'src/tags/tag.schema';

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

  @Prop({ type: String, isRequired: false, enum: closedBy, default: closedBy.TP_SL })
  closedBy: closedBy;

  @Prop({ type: mongoose.Types.Decimal128, isRequired: false })
  closedAt: number;

  @Prop({ type: mongoose.Types.Decimal128, isRequired: true })
  stopLoss: number;

  @Prop({ type: mongoose.Types.Decimal128, isRequired: true })
  takeProfit: number;

  riskReward: string;

  @Prop({ type: String, isRequired: true, enum: tradeDirection })
  direction: tradeDirection;

  @Prop({ type: String, isRequired: false, enum: orderType, default: orderType.MARKET })
  orderType: orderType;

  @Prop({ type: mongoose.Types.Decimal128 })
  pl?: number;

  @Prop({ type: String, isRequired: false })
  comment?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Account.name, required: true })
  @Type(() => Account)
  account: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Tag.name }] })
  @Type(() => Tag)
  tags?: Tag[];

  @Prop([UploadSchema])
  files?: Upload[];
}

export type TradeDocument = mongoose.HydratedDocument<Trade>;
export type TradeFilterFields = Partial<
  Pick<TradeDocument, 'openDate' | 'closeDate' | 'pair' | 'result' | 'stopLoss' | 'takeProfit' | 'direction'>
>;

const TradeSchema = SchemaFactory.createForClass(Trade);

TradeSchema.virtual('riskReward').get(function () {
  return this.takeProfit / this.stopLoss;
});

export { TradeSchema };
