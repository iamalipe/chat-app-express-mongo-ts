import { conversationModel } from "../models";

const getConversationsForUser = async (userId: string) => {
  try {
    // Fetch conversations from the database containing the current user's ID
    const conversations = await conversationModel.find({ users: userId });
    console.log(conversations);
    return [];
  } catch (error) {
    throw new Error("error fetching conversations");
  }
};
