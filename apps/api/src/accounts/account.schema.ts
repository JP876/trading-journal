import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

import { User } from 'src/user/user.schema';

@Schema()
export class Account extends mongoose.Document {
  @Prop({ type: String, isRequired: true })
  title: string;

  @Prop({ type: String, isRequired: false })
  description?: string;

  @Prop({ type: Boolean, isRequired: false, default: false })
  isMain?: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  @Type(() => User)
  user: mongoose.Types.ObjectId;
}

export type AccountDocument = mongoose.HydratedDocument<Account>;

const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.pre<AccountDocument>('save', async function () {
  if (!this.isMain) return;
  const model = this.constructor as mongoose.Model<Account>;
  await model.updateMany({ isMain: true }, { isMain: false });
});

AccountSchema.pre<AccountDocument>('deleteOne', { document: true, query: false }, async function () {
  await this.model('Trade').deleteMany({ account: this._id });
});

export { AccountSchema };
