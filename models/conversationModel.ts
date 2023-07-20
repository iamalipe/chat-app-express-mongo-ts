import { Document, Schema, model } from "mongoose";

export interface IOnlyUser {
  id: string;
  email: string;
}
export interface IConversation extends Document {
  _id: {
    id: string;
  };
  createTime: Date;
  lastMessageTime: Date;
  lastMessage: string;
  users: IOnlyUser[];
}

const conversationSchema = new Schema<IConversation>({
  createTime: {
    type: Date,
    default: Date.now,
  },
  lastMessageTime: {
    type: Date,
    required: false,
  },
  lastMessage: {
    type: String,
    required: false,
  },
  users: [],
});

export const conversationModel = model<IConversation>(
  "Conversation",
  conversationSchema
);
