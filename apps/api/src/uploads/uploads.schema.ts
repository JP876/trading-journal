import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { fileTypes } from './enums/file-types.enum';

@Schema({ timestamps: true })
export class Upload {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  path: string;

  @Prop({ type: String, required: true, enum: fileTypes, default: fileTypes.IMAGE })
  type: string;

  @Prop({ type: String, required: true })
  mime: string;

  @Prop({ type: Number, required: true })
  size: number;

  @Prop({ type: String, required: true })
  originalName: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type UploadDocument = mongoose.HydratedDocument<Upload>;

const UploadSchema = SchemaFactory.createForClass(Upload);
export { UploadSchema };
