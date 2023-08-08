import { Document, Schema, model } from "mongoose";

export interface IMessages extends Document {
  _id: {
    id: string;
  };
  conversationId: string;
  message: string;
  isImage: boolean;
  imageUrl: string;
  createdAt: Date;
  modifyAt: Date;
  senderId: string;
}

const messagesSchema: Schema<IMessages> = new Schema({
  message: {
    type: String,
    required: true,
  },
  isImage: {
    type: Boolean,
    required: true,
  },
  imageUrl: {
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
  senderId: {
    type: String,
    required: true,
  },
  conversationId: {
    type: String,
    required: true,
  },
});

export const messagesModel = model<IMessages>("Messages", messagesSchema);
