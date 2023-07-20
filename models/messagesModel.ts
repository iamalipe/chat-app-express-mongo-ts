import { Document, Schema, model } from "mongoose";

export interface IMessages extends Document {
  _id: {
    id: string;
  };
  conversationId: string;
  value: string;
  isImage: boolean;
  createTime: Date;
  senderId: string;
  senderEmail: string;
}

const messagesSchema = new Schema<IMessages>({
  value: {
    type: String,
    required: true,
  },
  isImage: {
    type: Boolean,
    required: true,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  senderId: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  conversationId: {
    type: String,
    required: true,
  },
});

export const messagesModel = model<IMessages>("Messages", messagesSchema);
