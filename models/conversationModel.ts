import { Document, Schema, model } from "mongoose";

export interface IConversation {
  _id: {
    id: string;
  };
  users: string[];
  createdAt: Date;
  modifyAt: Date;
  lastMessageId: string;
  lastMessageTime: Date;
  lastMessage: string;
  newMessageCount: number;
}

const conversationSchema: Schema<IConversation> = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifyAt: {
    type: Date,
    default: Date.now,
  },
  lastMessageTime: {
    type: Date,
  },
  lastMessage: {
    type: String,
  },
  lastMessageId: {
    type: String,
  },
  newMessageCount: {
    type: Number,
  },
  users: [],
});

export const conversationModel = model<IConversation>(
  "Conversation",
  conversationSchema
);
