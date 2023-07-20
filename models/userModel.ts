import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  _id: {
    id: string;
  };
  email: string;
  password: string;
  createTime: Date;
  modifyTime: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  modifyTime: {
    type: Date,
    default: Date.now,
  },
});

export const userModel = model<IUser>("User", userSchema);
