import { Document, Schema, model } from "mongoose";

export interface IUser {
  _id: {
    id: string;
  };
  username: string;
  email: string;
  profileImage: string;
  password: string;
  createdAt: Date;
  modifyAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifyAt: {
    type: Date,
    default: Date.now,
  },
});

export const userModel = model<IUser>("User", userSchema);
