import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt-ts';

import { UserSettings, UserSettingsSchema } from './settings.schema';

export type avatarType = {
  url: string;
  id: string;
};

@Schema()
class UserAvatar {
  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  id: string;
}

const UserAvatarSchema = SchemaFactory.createForClass(UserAvatar);

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class User extends mongoose.Document {
  @Prop({ type: String, required: false, unique: true })
  userName?: string;

  @Prop({ type: String, required: false })
  firstName?: string;

  @Prop({ type: String, required: false })
  lastName?: string;

  fullName: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, minlength: 6, required: true })
  password?: string;

  @Prop({ type: Boolean, required: true, default: false })
  isActive: boolean;

  @Prop(UserSettingsSchema)
  userSettings?: UserSettings;

  @Prop(UserAvatarSchema)
  avatar?: UserAvatar;

  comparePassword: (pass: string) => Promise<boolean>;

  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocumentOverride = {
  name: mongoose.Types.Subdocument<mongoose.Types.ObjectId> & UserSettings & UserAvatar;
};

export type UserDocument = mongoose.HydratedDocument<User, UserDocumentOverride>;

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
  const user = this as UserDocument;
  const userObject = user.toObject();

  userObject.fullName = `${user?.firstName} ${user?.lastName}`;

  delete userObject.password;
  delete userObject?.createdAt;
  delete userObject?.updatedAt;

  return userObject;
};

UserSchema.methods.comparePassword = async function (pass: string): Promise<boolean> {
  const user = this as UserDocument;
  const isMatch = await compare(pass, user?.password || '');
  return isMatch;
};

UserSchema.pre('save', async function () {
  const user = this as UserDocument;

  if (!user.isModified('password')) return;

  const salt = await genSalt();

  if (user.password) {
    user.password = await hash(user.password, salt);
  }
});

export { UserSchema };
