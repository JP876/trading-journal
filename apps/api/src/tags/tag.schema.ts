import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

import { User } from 'src/user/user.schema';

@Schema({ timestamps: true })
export class Tag extends mongoose.Document {
  @Prop({ type: String, isRequired: true })
  name: string;

  @Prop({ type: String, isRequired: true })
  color: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  @Type(() => User)
  user: mongoose.Types.ObjectId;
}

export type TagDocument = mongoose.HydratedDocument<Tag>;

const TagSchema = SchemaFactory.createForClass(Tag);
export { TagSchema };
